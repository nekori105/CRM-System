'use strict';

const Order = require('../models/Order'),
    errorHandler = require('../utils/errorHandlers'),
    moment = require('moment');

const FDate = 'DD.MM.YYYY'; // date format fo moment.js

module.exports.overview = async function (req, res) {
    try {
        const allOrders = await Order.find({user: req.user.id}).sort({date: 1}); // list of all orders
        const ordersMap = getOrdersMap(allOrders); // grouping by day of the week
        const yesterdayOrders = ordersMap[moment().add(-1, 'd').format(FDate)] || [];

        // the quantity of orders
        const totalOrdersNumber = allOrders.length;
        console.log('totalOrdersNumber: ', totalOrdersNumber);
        // the quantity of yesterday orders
        const yesterdayOrdersNumber = yesterdayOrders.length;
        console.log('yesterdayOrdersNumber: ', yesterdayOrdersNumber);
        // the quantity of days overall
        const daysNumber = Object.keys(ordersMap).length;
        console.log('daysNumber: ', daysNumber);
        // orders per day
        const ordersPerDay = (totalOrdersNumber / daysNumber).toFixed(0);
        console.log('ordersPerDay: ', ordersPerDay);
        // % for the quantity of order
        const ordersPercent = (((yesterdayOrdersNumber / ordersPerDay) - 1) * 100).toFixed(2);
        console.log('ordersPercent: ', ordersPercent);
        // total revenue
        const totalGain = calculatePrice(allOrders);
        console.log('totalGain: ', totalGain);
        // revenue per day
        const gainPerDay = totalGain / daysNumber;
        console.log('gainPerDay: ', gainPerDay);
        // revenue yesterday
        const yesterdayGain = calculatePrice(yesterdayOrders);
        console.log('yesterdayGain: ', yesterdayGain);
        // % of revenue
        const gainPercent = (((yesterdayGain / gainPerDay) - 1) * 100).toFixed(2);
        console.log('gainPercent: ', gainPercent);
        // revenue comparison
        const compareGain = (yesterdayGain - gainPerDay).toFixed(2);
        console.log('compareGain: ', compareGain);
        // comparison of the number of orders
        const compareNumber = (yesterdayOrdersNumber - ordersPerDay).toFixed(2);
        console.log('compareNumber: ', compareNumber);

        res.status(200).json({
            gain: {
                percent: Math.abs(+gainPercent),
                compare: Math.abs(+compareGain),
                yesterday: +yesterdayGain,
                isHigher: +gainPercent >= 0
            },
            orders: {
                percent: Math.abs(+ordersPercent),
                compare: Math.abs(+compareNumber),
                yesterday: +yesterdayOrdersNumber,
                isHigher: +ordersPercent >= 0
            }
        })
    } catch (e) {
        errorHandler(res, e);
    }
};

module.exports.analytic = async function (req, res) {
    try {
        const allOrders = await Order.find({user: req.user.id}).sort({date: 1});
        const ordersMap = getOrdersMap(allOrders);

        const average = +(calculatePrice(allOrders) / Object.keys(ordersMap).length).toFixed(2);
        console.log('all orders: ', calculatePrice(allOrders));
        console.log('quantity orders: ',  Object.keys(ordersMap).length);


        const chart = Object.keys(ordersMap).map(label => {
            // label == 22.11.2019
            const gain = calculatePrice(ordersMap[label]);
            const order = ordersMap[label].length;

            return {label, order, gain}
        });

        res.status(200).json({average, chart});

    } catch (e) {
        errorHandler(res, e);
    }
};

function getOrdersMap(orders = []) {
    const daysOrder = {};
    orders.forEach(order => {
        const date = moment(order.date).format('DD.MM.YYYY');

        // Не счиаем текущий день
        if (date === moment().format('DD.MM.YYYY')) {
            return
        }
        if (!daysOrder[date]) {
            daysOrder[date] = []
        }
        daysOrder[date].push(order)
    });
    return daysOrder
}

function calculatePrice(orders = []) {
    return orders.reduce((total, order) => {
        const orderPrice = order.list.reduce((orderTotal, item) => {
            return orderTotal += item.cost * item.quantity
        }, 0);
        return total += orderPrice
    }, 0)
}