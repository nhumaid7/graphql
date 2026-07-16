async function loadProfile() {
    const query = `
    {
        event_user(where: { userId: { _eq: 5571 } }) {
        userName
        userLogin
        level
        userAuditRatio
        }
    }
    `;

    const data = await graphqlRequest(query);

    console.log("Returned data:", data);

    if (!data) {
        console.error("graphqlRequest returned undefined");
        return;
    }

    document.getElementById("welcome-message").innerText =  `Welcome, ${data.event_user[0].userName}`;

}


loadProfile()

//graphql query
// event_user {
//         createdAt
//         eventId
//         id
//         level
//         userAuditRatio
//         userId
//         userLogin
//         userName
//         }