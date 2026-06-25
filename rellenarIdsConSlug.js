import mongoose from 'mongoose';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

async function actualizarIds() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('✅ Conectado a MongoDB');

        const db = mongoose.connection;
        const postSchema = new mongoose.Schema({}, { strict: false });
        const Post = db.model('blogposts', postSchema); // Cambiado a blogposts

        const posts = await Post.find({ nombre: { $ne: null } });
        console.log(`🔎 Encontrados ${posts.length} posts para procesar:`);

        for (const post of posts) {
            const query = post.nombre.toLowerCase().replace(/\s+/g, '+').replace(/[^\w+]/g, '');
            const url = `https://api.dofusdb.fr/items?slug.es[$search]=${query}`;
            console.log(`🔍 Buscando "${post.nombre}" en: ${url}`);

            try {
                const response = await axios.get(url);
                const item = response.data.data[0];

                if (item) {
                    const update = { id: item.id, iconId: item.iconId, slug: item.slug.es };
                    await Post.updateOne({ _id: post._id }, { $set: update });
                    console.log(`✅ Actualizado ${post.nombre}: id=${item.id}, iconId=${item.iconId}, slug=${item.slug.es}`);
                } else {
                    console.log(`⚠️ No se encontró imagen para ${post.nombre}`);
                }
            } catch (error) {
                console.error(`❌ Error buscando ${post.nombre}: ${error.message}`);
            }
        }

        await mongoose.disconnect();
        console.log('🔌 Desconectado de MongoDB');
    } catch (error) {
        console.error(`💥 Error general: ${error.message}`);
    }
}

actualizarIds();
