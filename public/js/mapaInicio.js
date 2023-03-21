/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/mapaInicio.js":
/*!******************************!*\
  !*** ./src/js/mapaInicio.js ***!
  \******************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n(function () {\r\n\r\n    const lat = -33.468296;\r\n    const lng = -70.5706927;\r\n    const mapa = L.map('mapa-inicio').setView([lat, lng], 16);\r\n    let markers = new L.FeatureGroup().addTo(mapa)\r\n    console.log(markers);\r\n    const filtros = {\r\n        categorias: '',\r\n        precios: ''\r\n    }\r\n    let props = [];\r\n\r\n    const categoriaSelect = document.querySelector('#categorias')\r\n    const precioSelect = document.querySelector('#precios')\r\n\r\n    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {\r\n        attribution: '&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors'\r\n    }).addTo(mapa);\r\n\r\n    categoriaSelect.addEventListener('change', e => {\r\n        filtros.categorias = +e.target.value //se puede pasasr a integer con el simbolo de +\r\n        FiltrarPorSelect()\r\n    })\r\n    precioSelect.addEventListener('change', e => {\r\n        filtros.precios = parseInt(e.target.value) // otra manera de pasar de STRING a integer\r\n        FiltrarPorSelect()\r\n\r\n    })\r\n\r\n    const obtenerPropiedadesApi = async () => {\r\n        try {\r\n            const url = '/api/propiedades'\r\n            const resp = await fetch(url)\r\n            props = await resp.json()\r\n\r\n            mostrarPropiedades(props)\r\n\r\n        } catch (error) {\r\n            console.log(error);\r\n        }\r\n    }\r\n    const mostrarPropiedades = (propiedades) => {\r\n        markers.clearLayers()\r\n        propiedades.forEach(element => {\r\n            const marker = new L.marker([element?.lat, element?.lng], {\r\n                autoPan: true\r\n            })\r\n                .addTo(mapa)\r\n                .bindPopup(`\r\n                    <p class=\"text-indigo-600 font-bold\">${element.categoria.nombre}</p>\r\n                    <h1 class=\"text-xl font-extrabold uppercase my-5\">${element.titulo}</h1>\r\n                    <img src=\"/uploads/${element?.imagen}\" alt=\"${element.titulo}\" >\r\n                    <p class=\"text-gray-600 font-bold\">${element.precio.nombre}</p>\r\n                    <a href=\"/propiedades/${element.id}\" class=\"text-center bg-indigo-600 block p-2 font-bold uppercase\"> Ver Propiedad </a>\r\n                `)\r\n\r\n            markers.addLayer(marker)\r\n        });\r\n    }\r\n    const FiltrarPorSelect = () => {\r\n        const propiedadesFiltradas = props.filter(filtrarPorCategorias).filter(filtrarPorPrecios)\r\n        mostrarPropiedades(propiedadesFiltradas);\r\n    }\r\n    const filtrarPorCategorias = (propiedad) => {\r\n        return filtros.categorias ? filtros.categorias === propiedad.categoriaId : propiedad\r\n    }\r\n    const filtrarPorPrecios = (propiedad) => {\r\n        return filtros.precios ? filtros.precios === propiedad.precioId : propiedad\r\n    }\r\n    obtenerPropiedadesApi()\r\n})()\n\n//# sourceURL=webpack://bienesraices_mvc/./src/js/mapaInicio.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/js/mapaInicio.js"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ })()
;