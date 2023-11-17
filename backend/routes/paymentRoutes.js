import express from 'express';
import sequelize from '../models/sequelize.js';
import {DataTypes} from 'sequelize';
import midtransClient from 'midtrans-client';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Definisikan model untuk pembayaran di luar route
const Pembayaran = sequelize.define('Pembayaran', {
    user_id: {
        type: DataTypes.INTEGER,
    },
    proyek_id: {
        type: DataTypes.INTEGER,
    },
    jumlah_pembayaran: {
        type: DataTypes.DECIMAL,
    },
}, {
    tableName: 'Pembayaran'
});

// Inisialisasi konfigurasi klien Midtrans
const snap = new midtransClient.Snap({
    isProduction: false,
    serverKey: process.env.MIDTRANS_SERVER_KEY,
    clientKey: process.env.MIDTRANS_CLIENT_KEY,
});

router.post('/process-transaction', async (req, res) => {
    try {
        const parameter = {
            transaction_details: {
                order_id: req.body.order_id,
                gross_amount: req.body.jumlah,
            },
            customer_details: {
                user_id: req.body.user_id,
            },
        };

        // Buat transaksi di Midtrans
        const transaction = await snap.createTransaction(parameter);

        // Simpan informasi pembayaran ke dalam basis data
        await Pembayaran.create({
            user_id: req.body.user_id,
            proyek_id: req.body.order_id,
            jumlah_pembayaran: req.body.jumlah,
        });

        // Kirim respon ke klien dengan token dari Midtrans
        res.status(200).json({
            message: 'Berhasil menambahkan pembayaran.',
            token: transaction.token
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

export default router;