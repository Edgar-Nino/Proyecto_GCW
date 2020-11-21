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

firestore.collection("highScores").orderBy("puntuaje", "desc").limit(5)
    .onSnapshot(function (querySnapshot) {
        var content = '';
        $("#highScoresTable tbody").empty();
        querySnapshot.forEach(function (data) {
            var val = data.data();
            content += '<tr>';
            content += '<td>' + val.nombre + '</td>';
            content += '<td>' + val.puntuaje + '</td>';
            let fecha = val.fecha.toDate().toString();
            fecha = fecha.substring(0, fecha.length - 32);
            content += '<td>' + fecha + '</td>';

            content += '</tr>';
        });
        $('#highScoresTable').append(content);
    });

firestore.collection("sala").where("numUsuarios", "<", 2).limit(10)
    .onSnapshot(function (querySnapshot) {
        var content = '';
        $("#salasTable tbody").empty();
        querySnapshot.forEach(function (data) {
            var val = data.data();
            var id = data.id;
            content += '<tr id=' + id + '>';
            content += '<td>' + id + '</td>';
            content += '<td>' + val.Player1.username + '</td>';
            content += '<td>' + val.Nivel + '</td>';
            content += '<td><button class="multiSelector btn btn-primary">Unirse</button></td>';

            content += '</tr>';
        });
        $('#salasTable').append(content);
    });
    
function joinSala(id, actualUsername) {
    firestore.collection("sala").doc(id).update({
        Player2: { username: actualUsername, ready: false },
        numUsuarios: 2,
    })
        .then(function () {
            console.log("Document successfully written!");
        })
        .catch(function (error) {
            console.error("Error writing document: ", error);
        });

}

function getNivel(id) {
    return new Promise((resolve, reject) => {
        var docRef = firestore.collection("sala").doc(id);

        docRef.get().then(function (doc) {
            if (doc.exists) {
                resolve(doc.data().Nivel);
            } else {
                return reject("No such document");
            }
        }).catch(function (error) {
            reject("Error getting document:", error);
        });
    })
}

function createSala(aLevel, actualUsername) {
    return new Promise((resolve, reject) => {
        var docRef = firestore.collection("sala").add({
            Player1: { ready: false, 
                username: actualUsername ,},
            numUsuarios: 1,
            Nivel: aLevel,
        })
            .then(function (refDoc) {
                resolve(refDoc.id)
            }).catch(function (error) {
                reject("Error getting document:", error)
            })
    })
}