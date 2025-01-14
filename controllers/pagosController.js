const mongoose = require('mongoose');  
const Pago = require('../models/pagos');  
const Usuario = require('../models/User');  

exports.crearPago = async (req, res) => {  
    const { monto, tipoPago, referencia } = req.body;  
    const userDataCookie = req.cookies.userData;   

    // Verifica que todos los campos requeridos están presentes  
    if (!userDataCookie || !monto || !tipoPago) {  
        return res.status(400).json({ error: 'Faltan datos requeridos.' });  
    }  

    let email;  
    try {  
        const userData = JSON.parse(userDataCookie);   
        email = userData.email;  
    } catch (error) {  
        return res.status(400).json({ error: 'Error al procesar la cookie de usuario.' });  
    }  

    try {  
        const nuevoPago = new Pago({ email, monto, tipoPago, referencia });  
        await nuevoPago.save();  
        res.status(201).json(nuevoPago);  
    } catch (error) {  
        res.status(400).json({ error: 'Error al crear el pago.', details: error.message });  
    }  
};   

exports.obtenerPagos = async (req, res) => {  
    try {  
        const pagos = await Pago.find();  
        res.status(200).json(pagos);  
    } catch (error) {  
        res.status(500).json({ error: 'Error al obtener los pagos.' });  
    }  
};   

exports.aprobarPago = async (req, res) => {  
    const { id } = req.params;  

    try {  
        const pago = await Pago.findById(id);  
        if (!pago) return res.status(404).json({ error: 'Pago no encontrado.' });  

        pago.estado = 'aprobado';  
        await pago.save();  
        res.status(200).json(pago);  
    } catch (error) {  
        res.status(500).json({ error: 'Error al aprobar el pago.' });  
    }  
};  

exports.cancelarPago = async (req, res) => {  
    const { id } = req.params;  

    try {  
        const pago = await Pago.findById(id);  
        if (!pago) return res.status(404).json({ error: 'Pago no encontrado.' });  

        // Cambiar el estado a "cancelado"  
        pago.estado = 'cancelado';  
        await pago.save();  
        res.status(200).json(pago);  
    } catch (error) {  
        res.status(500).json({ error: 'Error al cancelar el pago.' });  
    }  
};  

// Si quieres manejar un estado de rechazo, puedes incluirlo aquí:  
exports.rechazarPago = async (req, res) => {  
    const { id } = req.params;  

    try {  
        const pago = await Pago.findById(id);  
        if (!pago) return res.status(404).json({ error: 'Pago no encontrado.' });  

          
        pago.estado = 'rechazado';  
        await pago.save();  
        res.status(200).json(pago);  
    } catch (error) {  
        res.status(500).json({ error: 'Error al rechazar el pago.' });  
    }  
};  

exports.obtenerPagoPorId = async (req, res) => {  
    const { id } = req.params;  

    try {  
        const pago = await Pago.findById(id);  
        if (!pago) return res.status(404).json({ error: 'Pago no encontrado.' });  

        res.status(200).json(pago);  
    } catch (error) {  
        res.status(500).json({ error: 'Error al obtener el pago.', details: error.message });  
    }  
}; 

exports.obtenerPagosPorEmail = async (req, res) => {  
    const userDataCookie = req.cookies.userData;  

    if (!userDataCookie) {  
        return res.status(400).json({ error: 'No se encontraron datos de usuario.' });  
    }  

    let email;  
    try {  
        const userData = JSON.parse(userDataCookie);  
        email = userData.email;  
    } catch (error) {  
        return res.status(400).json({ error: 'Error al procesar la cookie de usuario.' });  
    }  

    try {  
        const pagos = await Pago.find({ email: email });  // Buscar pagos por el email del usuario  
        res.status(200).json(pagos);  
    } catch (error) {  
        res.status(500).json({ error: 'Error al obtener los pagos.' });  
    }  
}; 