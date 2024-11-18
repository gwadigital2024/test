// Charger et afficher le message d'exécution du fichier
console.log("Le fichier server.js est en cours d'exécution...");

// Charger les modules requis
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const fetch = require("node-fetch");
const bodyParser = require("body-parser");

// Charger les variables d'environnement
dotenv.config();

// Récupérer la clé secrète depuis les variables d'environnement
const sumupSecretKey = process.env.SUMUP_SECRET_KEY;
console.log("Clé secrète SumUp : ", sumupSecretKey); // Afficher la clé pour vérifier

// Créer une instance de l'application Express
const app = express();
const PORT = process.env.PORT || 3000;

// Configurer les middlewares
app.use(cors()); // Permettre les requêtes cross-origin
app.use(bodyParser.json()); // Gérer les données JSON

// Route pour générer le checkout SumUp
app.post("/generate-checkout", async (req, res) => {
  try {
    const { amount, currency, description } = req.body;
console.log("Début de la requête à SumUp");
    // Appel API vers SumUp pour créer un checkout
    const response = await fetch("https://api.sumup.com/v0.1/checkouts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sumupSecretKey}`, // Utiliser la clé secrète récupérée
      },
      body: JSON.stringify({
        amount,
        currency,
        description,
	      }),
    });
console.log("En-tête Authorization : Bearer", sumupSecretKey);
console.log("Réponse reçue de SumUp");
    // Récupérer la réponse JSON
    const data = await response.json();

    // Vérifier si le checkout a bien été créé
    if (data.hosted_checkout_url) {
      res.json({ hosted_checkout_url: data.hosted_checkout_url });
    } else {
      res.status(400).json({ error: "Failed to create checkout", details: data });
    }
  } catch (error) {
    console.error("Erreur :", error); // Assurez-vous que cette ligne est complète et correcte
    res.status(500).json({ error: "Internal server error" });
  }
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
});
