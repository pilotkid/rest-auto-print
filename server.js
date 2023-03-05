/* eslint-disable */
try {
	var config = require("./config.json");
} catch (err) {
	var config = {};
}
const fs = require("fs");
const path = require("path");

const express = require("https-localhost")
const cors = require("cors");
const multer = require("multer");
const exp = express();
const port = config.port || 3232;
const ptp = require("pdf-to-printer");
try{
	require('./node_modules/pdf-to-printer/dist/SumatraPDF-3.4.6-32.exe')
	//["node_modules/pdf-to-printer/**/*","node_modules/unix-print/**/*"],
}catch{

}

const upload = multer({ dest: "uploads/" });
exp.use(cors());

exp.use(function (req, res, next) {
	console.log(
		req.headers["x-forwarded-for"] || req.socket.remoteAddress,
		req.method,
		req.url
	);
	next();
});

exp.get('/', (req,res,next)=>{
	res.json({
		hi:'mom'
	})
})

exp.post("/print", upload.single("data"), async (req, res) => {
	const tmpFilePath = req.file.path;

	// fs.writeFileSync(tmpFilePath, req.body, 'binary');
	try {
		await ptp.print(tmpFilePath,{
			sumatraPdfPath:'C:\\temp\\SumatraPDF.exe'
		});
		res.status(204).send();
	} catch (e) {
		res.status(500).send(e);
		console.log(e);
	} finally {
		try {
			fs.unlinkSync(tmpFilePath);
		} catch {}
	}
});

exp.use((error, req, res, next) => {
	console.log(
		"\n\n=========================={Error}============================"
	);
	console.log("Error Handling Middleware called");
	console.log("Path: ", req.path);
	console.error("Error: ", error);
	console.log(
		"=================================================================\n\n"
	);

	if (error.type == "redirect") res.redirect("/error");
	else if (error.type == "time-out")
		// arbitrary condition check
		res.status(408).send(error);
	else res.status(500).send(error);
});

exp.listen(port, () => {
	alive = true;
	console.log(`🚀  Server running on port ${port}`);
});

/* eslint-enable */
