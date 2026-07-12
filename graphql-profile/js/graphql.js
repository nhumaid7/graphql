async function graphqlRequest(query) {

    const token = localStorage.getItem("token");

     if (!token) {
    window.location.href = "index.html";
    return;

    const response = await fetch("https://learn.reboot01.com/api/graphql-engine/v1/graphql", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ query }),
    });

    if (!response.ok) {
        throw new Error("Failed to fetch data");
    }
   
}

    const result = await response.json();
    return result.data;
}