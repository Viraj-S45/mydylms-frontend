  const prefix = "http://127.0.0.1:8000"; // <-- set your actual prefix here

  document.addEventListener("DOMContentLoaded", () => {
    const logoutLink = document.querySelector("a[href='/index.html']");

    if (logoutLink) {
      logoutLink.addEventListener("click", async (e) => {
        e.preventDefault(); // stop default navigation

        try {
          await fetch(`${prefix}/auth/delete`, {
            method: "DELETE",
            credentials: "include", // send cookies if your API uses sessions
          });
        } catch (err) {
          console.error("Logout failed:", err);
        } finally {
          // always redirect, even if API fails
          window.location.href = "/index.html";
        }
      });
    }
  });
