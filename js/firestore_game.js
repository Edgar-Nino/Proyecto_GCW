var firebaseConfig = {
    apiKey: "AIzaSyD_DlfG_4e_n47j8Kc4OetUDWMYWELbW1E",
    authDomain: "gcw-slash-it.firebaseapp.com",
    databaseURL: "https://gcw-slash-it.firebaseio.com",
    projectId: "gcw-slash-it",
    storageBucket: "gcw-slash-it.appspot.com",
    messagingSenderId: "403474531031",
    appId: "1:403474531031:web:f7242904617de631522692",
    measurementId: "G-WYGMHRGNQD"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var firestore = firebase.firestore();

function uploadHighScore(nickname, puntuacion) {
    return new Promise((resolve, reject) => {
        var docRef = firestore.collection("highScores").add({
            fecha: firebase.firestore.Timestamp.now(),
            nombre: nickname,
            puntuaje: puntuacion
        })
            .then(function (refDoc) {
                resolve(refDoc.id)
            }).catch(function (error) {
                reject("Error getting document:", error)
            })
    })
}

function readyPlayer(id, Player, nickname) {
    if (Player == 1)
        firestore.collection("sala").doc(id).update({
            Player1: { ready: true, username: nickname },
        })
    else
        firestore.collection("sala").doc(id).update({
            Player2: { ready: true, username: nickname },
        })
}

function checkReady(idsala) {
    return new Promise((resolve, reject) => {
        firestore.collection("sala").doc(idsala)
            .onSnapshot(function (querySnapshot) {
                let player1 = (querySnapshot.data().Player1) ? querySnapshot.data().Player1.ready : false;
                let player2 = (querySnapshot.data().Player2) ? querySnapshot.data().Player2.ready : false;
                if (player1 && player2)
                    resolve(false);
            });
    })
}

function getData(idSala) {
    firestore.collection("sala").doc(idSala)
        .onSnapshot(function (querySnapshot) {
            return querySnapshot.data();
        });
}



function sendPuntuacion(idsala, player, puntuacion) {
    if (player == 1) {
        firestore.collection("sala").doc(idsala).update({
            P1puntuacion: puntuacion
        })
    } else if (player == 2) {
        firestore.collection("sala").doc(idsala).update({
            P2puntuacion: puntuacion
        })
    }
}

function sendLife(idsala, player, life) {
    if (player == 1) {
        firestore.collection("sala").doc(idsala).update({
            P1vida: life
        })
    } else if (player == 2) {
        firestore.collection("sala").doc(idsala).update({
            P2vida: life
        })
    }
}