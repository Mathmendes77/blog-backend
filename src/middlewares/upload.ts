import multer from "multer";

// Guardamos o arquivo em memória para persistir a imagem como BLOB no MySQL.
const armazenamento = multer.memoryStorage();

const filtroArquivo = (
  _req: Express.Request,
  arquivo: Express.Multer.File,
  callback: multer.FileFilterCallback
) => {
  const tiposPermitidos = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
  if (tiposPermitidos.includes(arquivo.mimetype)) {
    callback(null, true);
  } else {
    callback(new Error("Formato de imagem não suportado. Use PNG, JPG ou WEBP."));
  }
};

export const uploadImagem = multer({
  storage: armazenamento,
  fileFilter: filtroArquivo,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});
