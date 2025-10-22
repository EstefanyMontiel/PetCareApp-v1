// ✅ Servicio para subir imágenes a Cloudinary
// NO requiere dependencias adicionales, solo fetch

const CLOUDINARY_CONFIG = {
    CLOUD_NAME: 'dy8jhgpph', // ← Cámbialo por el tuyo
    UPLOAD_PRESET: 'pet_images_unsigned', // ← El que creaste
};

export const imageUploadService = {
    /**
     * Sube una imagen a Cloudinary
     * @param {string} imageUri - URI local de la imagen
     * @param {string} folder - Carpeta en Cloudinary (opcional)
     * @returns {Promise<{success: boolean, url: string, publicId: string}>}
     */
    uploadImage: async (imageUri, folder = 'pets') => {
        try {
            console.log('📤 Iniciando subida a Cloudinary...');
            console.log('📸 URI de imagen:', imageUri);

            // Crear FormData para enviar la imagen
            const formData = new FormData();
            
            // Agregar la imagen
            formData.append('file', {
                uri: imageUri,
                type: 'image/jpeg',
                name: `pet_${Date.now()}.jpg`,
            });

            // Agregar configuración
            formData.append('upload_preset', CLOUDINARY_CONFIG.UPLOAD_PRESET);
            formData.append('folder', folder);
            formData.append('timestamp', Date.now().toString());

            // URL de la API de Cloudinary
            const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.CLOUD_NAME}/image/upload`;

            console.log('🌐 Subiendo a:', cloudinaryUrl);

            // Hacer la petición
            const response = await fetch(cloudinaryUrl, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'multipart/form-data',
                },
            });

            // Parsear respuesta
            const result = await response.json();

            console.log('📦 Respuesta recibida:', result);

            if (response.ok && result.secure_url) {
                console.log('✅ Imagen subida exitosamente');
                console.log('🔗 URL:', result.secure_url);

                return {
                    success: true,
                    url: result.secure_url,
                    publicId: result.public_id,
                    format: result.format,
                    width: result.width,
                    height: result.height,
                };
            } else {
                console.error('❌ Error en respuesta:', result);
                throw new Error(
                    result.error?.message || 
                    'Error al subir la imagen a Cloudinary'
                );
            }
        } catch (error) {
            console.error('❌ Error subiendo imagen:', error);
            
            if (error.message.includes('Network')) {
                throw new Error('Error de conexión. Verifica tu internet.');
            } else if (error.message.includes('fetch')) {
                throw new Error('No se pudo acceder al servicio de imágenes.');
            } else {
                throw error;
            }
        }
    },

    /**
     * Optimiza una URL de Cloudinary para diferentes tamaños
     */
    getOptimizedUrl: (url, width = 800, height = 800) => {
        if (!url || !url.includes('cloudinary.com')) {
            return url;
        }

        // Insertar transformaciones de tamaño
        return url.replace(
            '/upload/',
            `/upload/w_${width},h_${height},c_fill,q_auto/`
        );
    },

    /**
     * Obtiene versión thumbnail
     */
    getThumbnailUrl: (url) => {
        return imageUploadService.getOptimizedUrl(url, 200, 200);
    },
};