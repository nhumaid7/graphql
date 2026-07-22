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

        transactions(
        where: { type: { _eq: "xp" } }
        order_by: { createdAt: desc }
        limit: 5
        ) {
        amount
        path
        createdAt
        }

        audits(
        where: { grade: { _is_null: true } }
        order_by: { createdAt: desc }
        limit: 5
        ) {
        createdAt

        group {
            path
        }

        private {
            code
        }
        }
    }
    }`;


    const data = await graphqlRequest(query);

    if (!data || data.user.length === 0) {
        console.error("No user found.");
        return;
    }

    const user = data.user[0];
    const xpEvents = user.events.filter(event => event.xp !== null);
    // console.log(xpEvents);
    // const projectName = xpEvents[0].xp.path.split("/").pop();

    document.getElementById("welcome-message").innerText =
        `Welcome, ${user.firstName}`;
    

    // Profile information
    document.getElementById("campus").textContent = user.campus;
 


        // document.getElementById("xp-graph").innerHTML = generateXpGraph(xpEvents);

        drawXPGraph(xpEvents);

        const recentTransactions = user.transactions;
        drawRecentXPGraph(recentTransactions);

        drawAuditGraph(user);
        drawAuditorActivity(user.audits);
    
    }

    const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "index.html";
    };

    loadProfile();

    document
        .getElementById("logout-btn")
        .addEventListener("click", logout);
