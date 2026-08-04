

function drawXPGraph(transactions) {

    let totalXP = 0;

    // Calculate total cumulative XP
    transactions.forEach(transaction => {
        totalXP += transaction.amount;
    });

    const maxXP = totalXP;

    const svg = document.getElementById("xp-graph");

    let circles = "";
    let path = "";
    let xLabels = "";
    let yLabels = "";

    const spacing =
        transactions.length > 1
            ? 600 / (transactions.length - 1)
            : 600;

    // Build Y-axis labels
    const numberOfTicks = 5;

    for (let i = 0; i <= numberOfTicks; i++) {

        const value = (maxXP * (numberOfTicks - i)) / numberOfTicks;
        const y = 50 + i * 40;

        yLabels += `
            <text
                x="40"
                y="${y}"
                font-size="12"
                text-anchor="end"
            >
                ${formatKB(value)}
            </text>
        `;
    }

    // Running total
    totalXP = 0;

    transactions.forEach((transaction, index) => {

        totalXP += transaction.amount;

        const x = 70 + index * spacing;
        const y = 250 - (totalXP / maxXP) * 200;

        const projectName =
            transaction.object?.name ||
            transaction.path.split("/").pop();

        circles += `
            <circle
                cx="${x}"
                cy="${y}"
                r="5"
                fill="#e8b8c6"
                stroke="white"
                stroke-width="2"
            >
                <title>
${projectName}
${formatKB(totalXP)}
                </title>
            </circle>
        `;

        if (index === 0) {
            path += `M ${x} ${y}`;
        } else {
            path += ` L ${x} ${y}`;
        }

        if (index % 2 === 0) {
            xLabels += `
                <text
                    x="${x}"
                    y="275"
                    font-size="10"
                    text-anchor="middle"
                >
                    ${projectName}
                </text>
            `;
        }
    });

    svg.innerHTML = `
        <!-- Y-axis -->
        <line
            x1="70"
            y1="30"
            x2="70"
            y2="250"
            stroke="#9a9a9a"
            stroke-width="2"
        />

        <!-- X-axis -->
        <line
            x1="70"
            y1="250"
            x2="670"
            y2="250"
            stroke="#9a9a9a"
            stroke-width="2"
        />

        <!-- Y-axis title -->
        <text
            x="18"
            y="145"
            transform="rotate(-90 18 145)"
            font-size="13"
            font-weight="bold"
        >
            Total XP
        </text>

        <!-- X-axis title -->
        <text
            x="370"
            y="300"
            text-anchor="middle"
            font-size="13"
            font-weight="bold"
        >
            Projects
        </text>

        ${yLabels}

        <path
            d="${path}"
            fill="none"
            stroke="#caa257"
            stroke-width="3"
        />

        ${circles}

        ${xLabels}
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

            <g class="copy-btn" data-code="${auditCode}" transform="translate(430, ${y - 15})">
                <rect class="copy-hit" x="-6" y="-6" width="30" height="30" fill="transparent"/>
                <g class="icon-copy">
                    <rect x="4" y="2" width="12" height="14" rx="2" ry="2"/>
                    <rect x="0" y="6" width="12" height="14" rx="2" ry="2"/>
                </g>
                <path class="icon-check" d="M2,11 L7,16 L17,4" fill="none" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
            </g>
        `;
    });

    svg.innerHTML = items;

    svg.querySelectorAll(".copy-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
            const code = btn.getAttribute("data-code");

            navigator.clipboard.writeText(code).then(() => {
                btn.classList.add("copied");
                setTimeout(() => btn.classList.remove("copied"), 1200);
            });
        });
    });
}


function formatKB(bytes) {
    return (bytes / 1000).toFixed(1) + " KB";
}