const TAMANHO_MAX_BYTES = 3 * 1024 * 1024;
const LARGURA_MAXIMA = 1400;
const QUALIDADE_JPEG = 0.82;

function lerArquivoComoDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Não foi possível ler a imagem selecionada'));
    reader.readAsDataURL(file);
  });
}

function comprimirImagem(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      URL.revokeObjectURL(url);

      const escala = Math.min(1, LARGURA_MAXIMA / img.width);
      const largura = Math.round(img.width * escala);
      const altura = Math.round(img.height * escala);

      const canvas = document.createElement('canvas');
      canvas.width = largura;
      canvas.height = altura;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, largura, altura);

      const dataUrl = canvas.toDataURL('image/jpeg', QUALIDADE_JPEG);
      const tamanhoEstimado = Math.ceil((dataUrl.length * 3) / 4);

      if (tamanhoEstimado > TAMANHO_MAX_BYTES) {
        reject(new Error('A imagem ainda está grande demais. Tente um print menor ou mais nítido.'));
        return;
      }

      resolve(dataUrl);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Não foi possível processar a imagem selecionada'));
    };

    img.src = url;
  });
}

export async function fileToBase64(file) {
  if (!file) {
    throw new Error('Selecione uma imagem do comprovante');
  }

  if (!file.type.startsWith('image/')) {
    throw new Error('O comprovante deve ser uma imagem (JPEG, PNG ou WebP)');
  }

  if (file.size > TAMANHO_MAX_BYTES) {
    throw new Error('A imagem deve ter no máximo 3MB');
  }

  try {
    return await comprimirImagem(file);
  } catch {
    return lerArquivoComoDataUrl(file);
  }
}
