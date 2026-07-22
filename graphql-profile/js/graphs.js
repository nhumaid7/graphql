

function drawXPGraph(xpEvents) {

    // Calculate total XP (used for scaling)
    let totalXP = 0;

    xpEvents.forEach(event => {
        totalXP += event.xp.amount;
    });

    const maxXP = totalXP;

    const svg = document.getElementById("xp-graph");

    let circles = "";   
    let path = "";
    const spacing = 600 / (xpEvents.length - 1);

    // Reset total XP so we can build the running total
    totalXP = 0;

    xpEvents.forEach((event, index) => {

        totalXP += event.xp.amount;

        const x = 50 + index * spacing;
        const y = 250 - (totalXP / maxXP) * 200;

        circles += `
            <circle
                cx="${x}"
                cy="${y}"
                r="5"
                fill="red"
            />
        `;

        if (index === 0) {
            path += `M ${x} ${y}`;
        } else {
            path += ` L ${x} ${y}`;
        }

    });
    svg.innerHTML = `
        <!-- X-axis -->
        <line
            x1="50"
            y1="250"
            x2="650"
            y2="250"
            stroke="black"
            stroke-width="2"
        />

        <!-- Y-axis -->
        <line
            x1="50"
            y1="20"
            x2="50"
            y2="250"
            stroke="black"
            stroke-width="2"
        />


        <path
            d="${path}"
            fill="none"
            stroke="blue"
            stroke-width="2"
        />
        ${circles}
    `;

}


function drawRecentXPGraph(transactions) {

    const svg = document.getElementById("recent-xp-graph");

    const maxXP = Math.max(
        ...transactions.map(transaction => transaction.amount)
    );

    let bars = "";

    transactions.forEach((transaction, index) => {

        const projectName = transaction.path.split("/").pop();
        const width = (transaction.amount / maxXP) * 350;
        const y = 30 + index * 40;

        bars += `
            <!-- Project name -->
            <text
                x="10"
                y="${y + 15}"
                font-size="14"
            >
                ${projectName}
            </text>

            <!-- XP bar -->
            <rect
                x="180"
                y="${y}"
                width="${width}"
                height="20"
                fill="purple"
            />

            <!-- XP amount -->
            <text
                x="${190 + width}"
                y="${y + 15}"
                font-size="14"
            >
                ${(transaction.amount / 1000).toFixed(1)} KB
            </text>
        `;
    });

    svg.innerHTML = bars;
}


function drawAuditGraph(user) {

    const maxValue = Math.max(user.totalUp, user.totalDown);
    const doneWidth = (user.totalUp / maxValue) * 400;
    const receivedWidth = (user.totalDown / maxValue) * 400;

    const svg = document.getElementById("audit-graph");

svg.innerHTML = `
    <!-- Done label -->
    <text
        x="20"
        y="25"
        font-size="16"
    >
        Done (${formatKB(user.totalUp)})
    </text>

    <!-- Done bar -->
    <rect
        x="20"
        y="35"
        width="${doneWidth}"
        height="12"
        fill="#00d4aa"
    />

    <!-- Received label -->
    <text
        x="20"
        y="80"
        font-size="16"
    >
        Received (${formatKB(user.totalDown)})
    </text>

    <!-- Received bar -->
    <rect
        x="20"
        y="90"
        width="${receivedWidth}"
        height="12"
        fill="#cccccc"
    />

    <!-- Audit Ratio -->
    <text
        x="20"
        y="160"
        font-size="40"
        fill="#00d4aa"
    >
        ${user.auditRatio.toFixed(2)}
    </text>

    <text
        x="110"
        y="160"
        font-size="18"
    >
        Audit Ratio
    </text>
`;
}


function drawAuditorActivity(audits) {

    const svg = document.getElementById("auditor-activity");

    let items = "";

    audits.forEach((audit, index) => {

        const projectName = audit.group.path.split("/").pop();
        const auditCode = audit.private.code;

        const y = 30 + index * 35;

        items += `
            <text
                x="20"
                y="${y}"
                font-size="16"
                font-weight="bold"
            >
                ${projectName}
            </text>

            <text
                x="250"
                y="${y}"
                font-size="14"
            >
                Audit Code: ${auditCode}
            </text>
        `;
    });

    svg.innerHTML = items;
}


function formatKB(bytes) {
    return (bytes / 1000).toFixed(1) + " KB";
}