console.log("Service Worker Loaded...");
//push notification service worker
self.addEventListener("push", (e) => {
	const data = e.data.json();
	console.log("Push Recieved...");
	self.registration.showNotification(data.title, data.body, {
		body: "You are not subsribed to notifications from moodBUMP!",
		icon: "../images/app-icon-192x192.png",
	});
});
