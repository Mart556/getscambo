export const fetchData = async (url, options = {}) => {
	try {
		const response = await fetch(url, {
			...options,
			credentials: "include",
			mode: "cors",
		});
		if (!response.ok) {
			throw new Error("Network response was not ok");
		}
		return await response.json();
	} catch (error) {
		console.error("Fetch error:", error);
		throw error;
	}
};
