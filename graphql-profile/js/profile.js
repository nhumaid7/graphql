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

            recentTransactions: transactions(
                where: {
                    type: { _eq: "xp" }
                    object: {
                        type: { _eq: "project" }
                    }
                }
                order_by: { createdAt: desc }
                limit: 20
            ) {
                amount
                path
                createdAt

                object {
                    name
                    type
                }
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
const xpProgress = [...user.recentTransactions].reverse();
    document.getElementById("welcome-message").innerText =
        `Welcome, ${user.firstName}`;

    document.getElementById("campus").textContent = user.campus;

    drawXPGraph(xpProgress);
    drawRecentXPGraph(user.recentTransactions);
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