//use Admin;
db.createUser({
	user: "USERNAME",
	pwd: "PASSWORD",
	roles: [
		{
			role: "dbOwner",
			db: "Admin"
		},
		{
			role: "dbOwner",
			db: "mean-dev"
		}
	]
});
