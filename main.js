// Recuperation de l'element avec pour id: 'img'
let theImg = document.getElementById("img");

// Initialisation des paramètres 
let xStitch = 64; //nombres de mailles pour la longueur
let yStitch = 0; // nombres de mailles pour la hauteur (0 pour un ratio automatique de l'image)
let contrast = 60; // % du contrast max detecter sur l'image d'origine

// Charger l'image
let img1 = new Image();
img1.src = theImg.src;

// execution du script sur l'evenement onload de img1
img1.onload = function () {

    // ++ retirer l'image d'origine de l'element html
    // theImg.remove();

    // Redimensionner l'image
    let sample_size = Math.round(theImg.width / xStitch); // quote d'un seul carré
    let newWidth = sample_size * xStitch;
    if (yStitch == 0) {
        newHeight = Math.round(theImg.height / sample_size) * sample_size; // ratio automatique

    }
    else {
        newHeight = sample_size * yStitch;
    }
    w = newWidth;
    h = newHeight;

    // creation d'un canvas sur sur l'image de base avec les nouvelles quotes
    let c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    ctx = c.getContext("2d");
    ctx.translate(0.5, 0.5); // permet de reduire l'effet de 'flou' sur le canvas
    ctx.drawImage(img1, 0, 0, w, h);

    ctx.lineWidth = sample_size / 200; // epaisseur des lignes du cadrillage

    // Parcourir chaque pixel du canvas
    let pixelArr = ctx.getImageData(0, 0, w, h).data;
    for (let y = 0; y != h; y += sample_size) {
        for (let x = 0; x != w; x += sample_size) {

            // separation de chaque pixel et de ses valeurs RGBA
            let p = (x + (y * w)) * 4; // R = p ; G = p+1 ; B = p+2 ; A = p+3

            // ++ pixelisation par couleurs d'origine sur le canvas
            // ctx.fillStyle = "rgba(" + pixelArr[p] + "," + pixelArr[p + 1] + "," + pixelArr[p + 2] + "," + pixelArr[p + 3] + ")";

            // pixelisation bi-couleur (B&W) trier par niveau de contrast
            if ((pixelArr[p] + pixelArr[p + 1] + pixelArr[p + 2]) < contrast * 7.65) {
                ctx.fillStyle = "black";

            }
            else {
                ctx.fillStyle = "white";

            }
            ctx.fillRect(x, y, sample_size, sample_size);

            // creation des ligne pour le cadrillage avec condition pour les performances
            if ((y % sample_size == 0)) {

                ctx.beginPath();
                ctx.strokeStyle = "grey";

                // cadrillage horizontale
                ctx.moveTo(0, y);
                ctx.lineTo(w, y);

                // cadrillage verticale
                ctx.moveTo(x, 0);
                ctx.lineTo(x, h);

                ctx.stroke();
            }
        }
    }

    // Ajouter l'image personnalisée à l'élément HTML
    let img2 = new Image();
    img2.src = c.toDataURL("image/jpg");
    document.body.appendChild(img2);

}


