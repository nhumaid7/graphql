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