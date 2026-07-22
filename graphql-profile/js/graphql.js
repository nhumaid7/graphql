async function graphqlRequest(query) {
console.log("graphqlRequest started");
    const token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "index.html";
        return;
    }

    const response = await fetch(
        "https://learn.reboot01.com/api/graphql-engine/v1/graphql",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ query }),
        }
    );

    const result = await response.json();

    console.log("GraphQL response:", result);

    return result.data;
}