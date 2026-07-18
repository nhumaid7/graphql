async function loadProfile() {
    const query = `
    query {
    user {

        login
        firstName
        lastName
        auditRatio
        totalUp
        totalDown
        campus

        events {

            level

            xp {
                amount
                path
                originEventId
            }

        }

        }
    }
    `;

    const data = await graphqlRequest(query);
    // console.log(data.user);

    const user = data.user[0];
    const xpEvents = user.events.filter(event => event.xp !== null);
    // console.log(xpEvents);
    // const projectName = xpEvents[0].xp.path.split("/").pop();

    if (!data || data.user.length === 0) {
        console.error("No user found.");
        return;
    }

    document.getElementById("welcome-message").innerText =
        `Welcome, ${user.firstName}`;
    

    // Profile information
    document.getElementById("login").textContent = user.login;
    document.getElementById("first-name").textContent = user.firstName;
    document.getElementById("last-name").textContent = user.lastName;
    document.getElementById("campus").textContent = user.campus;
    document.getElementById("audit-ratio").textContent =
        user.auditRatio.toFixed(2);
    document.getElementById("total-up").textContent =
        user.totalUp.toLocaleString();
    document.getElementById("total-down").textContent =
        user.totalDown.toLocaleString();


        // document.getElementById("xp-graph").innerHTML = generateXpGraph(xpEvents);

        drawXPGraph(xpEvents);
    }
    
    loadProfile()
