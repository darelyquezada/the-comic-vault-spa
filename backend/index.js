// Punto de entrada principal del servidor

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor backend en puerto ${PORT}`);
});