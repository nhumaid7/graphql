

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

    const spacing =
        transactions.length > 1
            ? 600 / (transactions.length - 1)
            : 600;

    // Running total
    totalXP = 0;

    transactions.forEach((transaction, index) => {

        totalXP += transaction.amount;

        const x = 70 + index * spacing;
        const y = 270 - (totalXP / maxXP) * 240;

        const projectName =
            transaction.object?.name ||
            transaction.path.split("/").pop();

        circles += `
            <circle
                class="xp-dot"
                cx="${x}"
                cy="${y}"
                r="5"
                fill="#e8b8c6"
                stroke="white"
                stroke-width="2"
                data-project="${projectName}"
                data-xp="${formatKB(totalXP)}"
            ></circle>
        `;

        if (index === 0) {
            path += `M ${x} ${y}`;
        } else {
            path += ` L ${x} ${y}`;
        }
    });

    svg.innerHTML = `
        <!-- Y-axis -->
        <line
            x1="70"
            y1="30"
            x2="70"
            y2="270"
            stroke="#9a9a9a"
            stroke-width="2"
        />

        <!-- X-axis -->
        <line
            x1="70"
            y1="270"
            x2="670"
            y2="270"
            stroke="#9a9a9a"
            stroke-width="2"
        />

        <path
            d="${path}"
            fill="none"
            stroke="#caa257"
            stroke-width="3"
        />

        ${circles}
    `;

    const tooltip = document.getElementById("chart-tooltip");

    svg.querySelectorAll(".xp-dot").forEach((dot) => {

        const showTooltip = (event) => {
            tooltip.innerHTML = `<strong>${dot.dataset.project}</strong><span>${dot.dataset.xp}</span>`;
            tooltip.style.left = `${event.clientX}px`;
            tooltip.style.top = `${event.clientY}px`;
            tooltip.classList.add("visible");
        };

        dot.addEventListener("mouseenter", showTooltip);
        dot.addEventListener("mousemove", showTooltip);
        dot.addEventListener("mouseleave", () => {
            tooltip.classList.remove("visible");
        });
    });
}


function drawRecentXPGraph(transactions) {

    const svg = document.getElementById("recent-xp-graph");

    const maxXP = Math.max(
        ...transactions.map(transaction => Math.max(transaction.amount, 0))
    );

    const rowHeight = 42;
    const topMargin = 30;
    const bottomMargin = 20;
    const contentHeight = topMargin + transactions.length * rowHeight + bottomMargin;

    // Grow the coordinate space to fit every row instead of
    // letting rows past the old fixed height get clipped off.
    svg.setAttribute("viewBox", `0 0 700 ${contentHeight}`);
    svg.setAttribute("height", contentHeight);

    let bars = "";

    transactions.forEach((transaction, index) => {

        const projectName = transaction.path.split("/").pop();
        const width = Math.max((transaction.amount / maxXP) * 320, 0);
        const y = 30 + index * rowHeight;

        bars += `
            <!-- Project name -->
            <text
                x="10"
                y="${y + 16}"
                font-size="17"
            >
                ${projectName}
            </text>

            <!-- XP bar -->
            <rect
                x="220"
                y="${y}"
                width="${width}"
                height="22"
                fill="purple"
            />

            <!-- XP amount -->
            <text
                x="${230 + width}"
                y="${y + 16}"
                font-size="17"
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
        y="26"
        font-size="19"
    >
        Done (${formatKB(user.totalUp)})
    </text>

    <!-- Done bar -->
    <rect
        x="20"
        y="36"
        width="${doneWidth}"
        height="14"
        fill="#00d4aa"
    />

    <!-- Received label -->
    <text
        x="20"
        y="83"
        font-size="19"
    >
        Received (${formatKB(user.totalDown)})
    </text>

    <!-- Received bar -->
    <rect
        x="20"
        y="93"
        width="${receivedWidth}"
        height="14"
        fill="#cccccc"
    />

    <!-- Audit Ratio -->
    <text
        x="20"
        y="165"
        font-size="46"
        fill="#00d4aa"
    >
        ${user.auditRatio.toFixed(2)}
    </text>

    <text
        x="140"
        y="165"
        font-size="21"
    >
        Audit Ratio
    </text>
`;
}

function drawAuditorActivity(audits) {

    const svg = document.getElementById("auditor-activity");

    const rowHeight = 40;
    const margin = 30;
    const contentHeight = margin * 2 + audits.length * rowHeight;

    // Equal top/bottom margins so the row block sits exactly centered,
    // regardless of how many audits there are or the card's rendered size.
    svg.setAttribute("viewBox", `0 0 700 ${contentHeight}`);
    svg.setAttribute("height", contentHeight);

    let items = "";

    audits.forEach((audit, index) => {

        const projectName = audit.group.path.split("/").pop();
        const auditCode = audit.private.code;

        const y = margin + index * rowHeight + 26;

        items += `
            <text
                x="20"
                y="${y}"
                font-size="19"
                font-weight="bold"
            >
                ${projectName}
            </text>

            <text
                x="260"
                y="${y}"
                font-size="17"
            >
                Audit Code: ${auditCode}
            </text>

            <g class="copy-btn" data-code="${auditCode}" transform="translate(470, ${y - 17})">
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