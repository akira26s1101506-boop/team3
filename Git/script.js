/* =================================
   MITSUKETA
   ゲーム投稿SNS
================================= */


/* =================================
   データ
================================= */

let users = JSON.parse(
    localStorage.getItem("mitsuketaUsers")
) || [];

let posts = JSON.parse(
    localStorage.getItem("mitsuketaPosts")
) || [];

let notifications = JSON.parse(
    localStorage.getItem("mitsuketaNotifications")
) || [];

let currentUser = JSON.parse(
    localStorage.getItem("mitsuketaCurrentUser")
) || null;

let currentTab = "recommend";


/* =================================
   初期ユーザー・投稿
================================= */

if (users.length === 0) {

    users = [
        {
            name: "さくら",
            userId: "sakura_01",
            password: "1234",
            bio: "ゲーム好きです🎮"
        },
        {
            name: "ゆうき",
            userId: "yuki_07",
            password: "1234",
            bio: "隠れたゲーム探してます"
        }
    ];

    localStorage.setItem(
        "mitsuketaUsers",
        JSON.stringify(users)
    );
}


if (posts.length === 0) {

    posts = [

        {
            id: 1,

            userId: "sakura_01",
            name: "さくら",

            text:
                "最近見つけたゲーム！\n知ってる人少ないけどかなり面白い🎮",

            image: "",

            tags: [
                "#隠れた名作",
                "#おすすめゲーム"
            ],

            likes: 24,
            likedBy: [],

            reposts: 5,
            repostedBy: [],

            comments: 3,

            createdAt:
                new Date(
                    Date.now() - 2 * 60 * 60 * 1000
                ).toISOString()
        },


        {
            id: 2,

            userId: "yuki_07",
            name: "ゆうき",

            text:
                "昔のゲームだけど今やっても普通に面白い！",

            image: "",

            tags: [
                "#レトロゲーム",
                "#ゲーム"
            ],

            likes: 17,
            likedBy: [],

            reposts: 4,
            repostedBy: [],

            comments: 1,

            createdAt:
                new Date(
                    Date.now() - 5 * 60 * 60 * 1000
                ).toISOString()
        }

    ];

    localStorage.setItem(
        "mitsuketaPosts",
        JSON.stringify(posts)
    );
}


/* =================================
   保存
================================= */

function saveData() {

    localStorage.setItem(
        "mitsuketaUsers",
        JSON.stringify(users)
    );

    localStorage.setItem(
        "mitsuketaPosts",
        JSON.stringify(posts)
    );

    localStorage.setItem(
        "mitsuketaNotifications",
        JSON.stringify(notifications)
    );

    localStorage.setItem(
        "mitsuketaCurrentUser",
        JSON.stringify(currentUser)
    );
}


/* =================================
   ログイン・登録
================================= */

function showRegister() {

    document
        .getElementById("loginPage")
        .classList.add("hidden");

    document
        .getElementById("registerPage")
        .classList.remove("hidden");
}


function showLogin() {

    document
        .getElementById("registerPage")
        .classList.add("hidden");

    document
        .getElementById("loginPage")
        .classList.remove("hidden");
}


function register() {

    const name =
        document.getElementById("registerName").value.trim();

    const userId =
        document.getElementById("registerId").value.trim();

    const password =
        document.getElementById("registerPassword").value.trim();

    const error =
        document.getElementById("registerError");


    if (!name || !userId || !password) {

        error.textContent =
            "すべて入力してください。";

        return;
    }


    const exists =
        users.some(
            user => user.userId === userId
        );


    if (exists) {

        error.textContent =
            "そのユーザーIDはすでに使われています。";

        return;
    }


    const newUser = {

        name: name,

        userId: userId,

        password: password,

        bio: "よろしくお願いします！"

    };


    users.push(newUser);

    currentUser = newUser;

    saveData();

    startApp();
}


function login() {

    const userId =
        document.getElementById("loginId").value.trim();

    const password =
        document.getElementById("loginPassword").value.trim();

    const error =
        document.getElementById("loginError");


    const user =
        users.find(
            user =>
                user.userId === userId &&
                user.password === password
        );


    if (!user) {

        error.textContent =
            "ユーザーIDまたはパスワードが違います。";

        return;
    }


    currentUser = user;

    saveData();

    startApp();
}


/* =================================
   アプリ開始
================================= */

function startApp() {

    document
        .getElementById("loginPage")
        .classList.add("hidden");

    document
        .getElementById("registerPage")
        .classList.add("hidden");

    document
        .getElementById("app")
        .classList.remove("hidden");

    showHome();
}


/* =================================
   ページ切り替え
================================= */

function hidePages() {

    document
        .querySelectorAll(".page")
        .forEach(page => {

            page.classList.add("hidden");

        });
}


function showHome() {

    hidePages();

    document
        .getElementById("homePage")
        .classList.remove("hidden");

    displayPosts();

    updateNotificationCount();
}


function showPostPage() {

    hidePages();

    document
        .getElementById("postPage")
        .classList.remove("hidden");


    document
        .getElementById("postUserName")
        .textContent = currentUser.name;


    document
        .getElementById("postUserId")
        .textContent =
            "@" + currentUser.userId;
}


function showNotifications() {

    hidePages();

    document
        .getElementById("notificationPage")
        .classList.remove("hidden");

    displayNotifications();

    updateNotificationCount();
}


function showMyProfile() {

    hidePages();

    document
        .getElementById("profilePage")
        .classList.remove("hidden");

    displayProfile();
}


function showProfileSetting() {

    hidePages();

    document
        .getElementById("profileSettingPage")
        .classList.remove("hidden");


    document
        .getElementById("editName")
        .value = currentUser.name;


    document
        .getElementById("editId")
        .value = currentUser.userId;


    document
        .getElementById("editBio")
        .value = currentUser.bio || "";
}


/* =================================
   ホーム投稿表示
================================= */

function displayPosts() {

    const list =
        document.getElementById("postList");

    list.innerHTML = "";


    let displayPosts = [...posts];


    if (currentTab === "recommend") {

        displayPosts.sort(
            (a, b) =>
                (b.likes + b.reposts) -
                (a.likes + a.reposts)
        );

    } else {

        displayPosts =
            displayPosts.filter(post => {

                return post.userId === currentUser.userId;

            });

    }


    displayPosts.forEach(post => {

        list.innerHTML += renderPost(post);

    });
}


/* =================================
   投稿HTML
================================= */

function renderPost(post) {

    const liked =
        post.likedBy &&
        post.likedBy.includes(
            currentUser.userId
        );


    const reposted =
        post.repostedBy &&
        post.repostedBy.includes(
            currentUser.userId
        );


    const isOwnPost =
        post.userId === currentUser.userId;


    const user =
        users.find(
            user => user.userId === post.userId
        );


    const isFollowing =
        user &&
        user.followers &&
        user.followers.includes(
            currentUser.userId
        );


    const time =
        formatTime(post.createdAt);


    const imageHTML =
        post.image
            ? `<img class="post-image" src="${post.image}">`
            : "";


    const tagsHTML =
        post.tags
            .map(tag => tag)
            .join(" ");


    return `

        <article class="post">

            <div class="post-top">

                <div class="avatar">
                    🎮
                </div>

                <div class="post-user-info">

                    <div class="post-user-name">
                        ${escapeHTML(post.name)}
                    </div>

                    <div class="post-user-id">
                        @${escapeHTML(post.userId)}
                        ·
                        <span class="post-time">
                            ${time}
                        </span>
                    </div>

                </div>

                ${
                    !isOwnPost
                    ?
                    `
                    <button
                        class="follow-button ${isFollowing ? "following" : ""}"
                        onclick="toggleFollow('${post.userId}')"
                    >
                        ${isFollowing ? "フォロー中" : "フォロー"}
                    </button>
                    `
                    :
                    ""
                }

            </div>


            <div class="post-text">
                ${escapeHTML(post.text).replace(/\n/g, "<br>")}
            </div>


            ${imageHTML}


            <div class="post-tags">
                ${tagsHTML}
            </div>


            <div class="post-actions">

                <button>
                    💬 ${post.comments}
                </button>

                <button
                    class="${reposted ? "like-active" : ""}"
                    onclick="repostPost(${post.id})"
                >
                    🔁 ${post.reposts}
                </button>

                <button
                    class="${liked ? "like-active" : ""}"
                    onclick="likePost(${post.id})"
                >
                    ❤️ ${post.likes}
                </button>

            </div>

        </article>

    `;
}


/* =================================
   いいね
================================= */

function likePost(id) {

    const post =
        posts.find(
            post => post.id === id
        );


    if (!post.likedBy) {

        post.likedBy = [];

    }


    const index =
        post.likedBy.indexOf(
            currentUser.userId
        );


    if (index === -1) {

        post.likedBy.push(
            currentUser.userId
        );

        post.likes++;


        if (
            post.userId !== currentUser.userId
        ) {

            addNotification(
                post.userId,
                `${currentUser.name}さんがあなたの投稿にいいねしました`
            );

        }

    } else {

        post.likedBy.splice(index, 1);

        post.likes--;

    }


    saveData();

    displayPosts();
}


/* =================================
   リポスト
================================= */

function repostPost(id) {

    const post =
        posts.find(
            post => post.id === id
        );


    if (!post.repostedBy) {

        post.repostedBy = [];

    }


    const index =
        post.repostedBy.indexOf(
            currentUser.userId
        );


    if (index === -1) {

        post.repostedBy.push(
            currentUser.userId
        );

        post.reposts++;

    } else {

        post.repostedBy.splice(index, 1);

        post.reposts--;

    }


    saveData();

    displayPosts();
}


/* =================================
   フォロー
================================= */

function toggleFollow(userId) {

    const user =
        users.find(
            user => user.userId === userId
        );


    if (!user) return;


    if (!user.followers) {

        user.followers = [];

    }


    const index =
        user.followers.indexOf(
            currentUser.userId
        );


    if (index === -1) {

        user.followers.push(
            currentUser.userId
        );


        addNotification(
            userId,
            `${currentUser.name}さんがあなたをフォローしました`
        );

    } else {

        user.followers.splice(index, 1);

    }


    saveData();

    displayPosts();
}


/* =================================
   画像プレビュー
================================= */

function previewImage(event) {

    const file =
        event.target.files[0];

    if (!file) return;


    const reader =
        new FileReader();


    reader.onload = function(e) {

        const preview =
            document.getElementById("imagePreview");

        preview.src = e.target.result;

        preview.classList.remove("hidden");


        document
            .getElementById("imageText")
            .classList.add("hidden");

    };


    reader.readAsDataURL(file);
}


/* =================================
   投稿作成
================================= */

function createPost() {

    const text =
        document
            .getElementById("postText")
            .value
            .trim();


    const tagText =
        document
            .getElementById("tagInput")
            .value
            .trim();


    const mention =
        document
            .getElementById("mentionInput")
            .value
            .trim();


    const image =
        document
            .getElementById("imagePreview")
            .src;


    if (!text && !image) {

        alert(
            "画像か文章を入力してください。"
        );

        return;
    }


    let tags =
        tagText
            .split(/\s+/)
            .filter(tag => tag !== "");


    if (mention) {

        const mentionId =
            mention.replace("@", "");


        const mentionedUser =
            users.find(
                user =>
                    user.userId === mentionId
            );


        if (mentionedUser) {

            addNotification(
                mentionedUser.userId,
                `${currentUser.name}さんがあなたをメンションしました`
            );

        }

    }


    const newPost = {

        id:
            Date.now(),

        userId:
            currentUser.userId,

        name:
            currentUser.name,

        text:
            text,

        image:
            image && image !== window.location.href
                ? image
                : "",

        tags:
            tags,

        likes:
            0,

        likedBy:
            [],

        reposts:
            0,

        repostedBy:
            [],

        comments:
            0,

        createdAt:
            new Date().toISOString()

    };


    posts.unshift(newPost);

    saveData();


    // 入力をリセット

    document
        .getElementById("postText")
        .value = "";

    document
        .getElementById("tagInput")
        .value = "";

    document
        .getElementById("mentionInput")
        .value = "";

    document
        .getElementById("imageInput")
        .value = "";

    document
        .getElementById("imagePreview")
        .src = "";

    document
        .getElementById("imagePreview")
        .classList.add("hidden");

    document
        .getElementById("imageText")
        .classList.remove("hidden");


    showHome();
}


/* =================================
   通知
================================= */

function addNotification(
    userId,
    message
) {

    notifications.unshift({

        id:
            Date.now(),

        userId:
            userId,

        message:
            message,

        createdAt:
            new Date().toISOString(),

        read:
            false

    });


    saveData();
}


function displayNotifications() {

    const list =
        document.getElementById(
            "notificationList"
        );


    const myNotifications =
        notifications.filter(
            notification =>
                notification.userId ===
                currentUser.userId
        );


    if (myNotifications.length === 0) {

        list.innerHTML = `
            <div class="notification">
                まだ通知はありません。
            </div>
        `;

        return;
    }


    list.innerHTML = "";


    myNotifications.forEach(notification => {

        list.innerHTML += `

            <div class="notification">

                ${escapeHTML(notification.message)}

                <span>
                    ${formatTime(notification.createdAt)}
                </span>

            </div>

        `;

        notification.read = true;

    });


    saveData();
}


function updateNotificationCount() {

    const count =
        notifications.filter(
            notification =>
                notification.userId ===
                currentUser.userId &&
                !notification.read
        ).length;


    const element =
        document.getElementById(
            "notificationCount"
        );


    element.textContent =
        count > 0
            ? count
            : "";
}


/* =================================
   プロフィール
================================= */

function displayProfile() {

    document
        .getElementById("profileName")
        .textContent =
            currentUser.name;


    document
        .getElementById("profileId")
        .textContent =
            "@" + currentUser.userId;


    document
        .getElementById("profileBio")
        .textContent =
            currentUser.bio || "";


    const myPosts =
        posts.filter(
            post =>
                post.userId ===
                currentUser.userId
        );


    document
        .getElementById("postCount")
        .textContent =
            myPosts.length;


    let followingCount = 0;

    users.forEach(user => {

        if (
            user.followers &&
            user.followers.includes(
                currentUser.userId
            )
        ) {

            followingCount++;

        }

    });


    document
        .getElementById("followingCount")
        .textContent =
            followingCount;


    const followers =
        users.find(
            user =>
                user.userId ===
                currentUser.userId
        );


    const followerCount =
        followers &&
        followers.followers
            ? followers.followers.length
            : 0;


    document
        .getElementById("followerCount")
        .textContent =
            followerCount;


    displayProfilePosts();
}


function displayProfilePosts() {

    const list =
        document.getElementById(
            "profilePosts"
        );


    const myPosts =
        posts.filter(
            post =>
                post.userId ===
                currentUser.userId
        );


    list.innerHTML = "";


    myPosts.forEach(post => {

        list.innerHTML +=
            renderPost(post);

    });
}


/* =================================
   プロフィール保存
================================= */

function saveProfile() {

    const name =
        document
            .getElementById("editName")
            .value
            .trim();


    const newId =
        document
            .getElementById("editId")
            .value
            .trim();


    const bio =
        document
            .getElementById("editBio")
            .value
            .trim();


    if (!name || !newId) {

        alert(
            "ユーザー名とIDを入力してください。"
        );

        return;
    }


    const oldId =
        currentUser.userId;


    // ID変更チェック

    if (oldId !== newId) {

        const exists =
            users.some(
                user =>
                    user.userId === newId
            );


        if (exists) {

            alert(
                "そのユーザーIDはすでに使われています。"
            );

            return;
        }

    }


    currentUser.name = name;

    currentUser.userId = newId;

    currentUser.bio = bio;


    const userIndex =
        users.findIndex(
            user =>
                user.userId === oldId
        );


    if (userIndex !== -1) {

        users[userIndex] =
            currentUser;

    }


    // 過去の投稿も更新

    posts.forEach(post => {

        if (post.userId === oldId) {

            post.userId = newId;

            post.name = name;

        }

    });


    saveData();

    showMyProfile();
}


/* =================================
   タブ切り替え
================================= */

function changeTab(tab) {

    currentTab = tab;


    document
        .getElementById("recommendTab")
        .classList.remove("active");


    document
        .getElementById("followTab")
        .classList.remove("active");


    if (tab === "recommend") {

        document
            .getElementById("recommendTab")
            .classList.add("active");

    } else {

        document
            .getElementById("followTab")
            .classList.add("active");

    }


    displayPosts();
}


/* =================================
   時刻表示
================================= */

function formatTime(dateString) {

    const date =
        new Date(dateString);

    const now =
        new Date();


    const diff =
        now - date;


    const minutes =
        Math.floor(
            diff / 60000
        );


    if (minutes < 1) {

        return "たった今";

    }


    if (minutes < 60) {

        return minutes + "分前";

    }


    const hours =
        Math.floor(
            minutes / 60
        );


    if (hours < 24) {

        return hours + "時間前";

    }


    const days =
        Math.floor(
            hours / 24
        );


    if (days < 7) {

        return days + "日前";

    }


    return (
        date.getFullYear() +
        "/" +
        (date.getMonth() + 1) +
        "/" +
        date.getDate()
    );
}


/* =================================
   HTML対策
================================= */

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent =
        text;

    return div.innerHTML;
}


/* =================================
   起動時
================================= */

if (currentUser) {

    startApp();

}