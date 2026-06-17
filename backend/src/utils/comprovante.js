import { AppError } from './response.js';

const TIPOS_PERMITIDOS = ['jpeg', 'jpg', 'png', 'webp'];
const TAMANHO_MAX_BYTES = 3 * 1024 * 1024;

export function validarComprovanteImagem(comprovante) {
  if (!comprovante) {
    return null;
  }

  const dataUrlRegex = /^data:image\/(jpeg|jpg|png|webp);base64,([A-Za-z0-9+/=\s]+)$/;
  const match = comprovante.trim().match(dataUrlRegex);

  if (!match) {
    throw new AppError('Comprovante deve ser uma imagem válida (JPEG, PNG ou WebP)', 400);
  }

  const tipo = match[1].toLowerCase();
  if (!TIPOS_PERMITIDOS.includes(tipo)) {
    throw new AppError('Formato de imagem não suportado. Use JPEG, PNG ou WebP', 400);
  }

  const base64 = match[2].replace(/\s/g, '');
  const tamanhoBytes = Math.ceil((base64.length * 3) / 4);

  if (tamanhoBytes > TAMANHO_MAX_BYTES) {
    throw new AppError('A imagem do comprovante deve ter no máximo 3MB', 400);
  }

  return `data:image/${match[1].toLowerCase() === 'jpg' ? 'jpeg' : match[1].toLowerCase()};base64,${base64}`;
}

export function sanitizarApostaParaLista(aposta) {
  const { comprovante, ...rest } = aposta;
  return {
    ...rest,
    temComprovante: Boolean(comprovante),
  };
}
