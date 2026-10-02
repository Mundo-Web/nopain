import React, { createContext, useState, useEffect } from "react";
import { Local } from "sode-extend-react";
import ItemsRest from "../actions/ItemRest";
import { i } from "framer-motion/client";

export const CarritoContext = createContext();
const itemsRest = new ItemsRest();

export const CarritoProvider = ({ children }) => {
    const [carrito, setCarrito] = useState(() => {
        const data = localStorage.getItem("carrito");
        if (data) {
            try {
                return JSON.parse(data);
            } catch (error) {
                console.warn("Invalid data in localStorage for carrito, resetting to empty array.", error);
                localStorage.removeItem("carrito");
                return [];
            }
        }
        return [];
    });
    //  console.log("data", carrito);

    // Función para obtener precios actualizados desde la API
    const actualizarPrecios = async () => {
        try {
            if (carrito.length === 0) return; // Evitar llamadas innecesarias
            itemsRest.verifyStock(carrito.map((x) => x.id)).then((items) => {
                const newCart = carrito.map((x) => {
                    const found = items.find((item) => item.id === x.id);
                    return found
                        ? {
                              ...x,
                              price: found.price,
                              final_price: found.final_price,
                              discount: found.discount,
                              name: found.name,
                          }
                        : x;
                });
                setCarrito(newCart);
            });
        } catch (error) {
            console.error("Error al actualizar precios:", error);
        }
    };

    // Cargar carrito desde localStorage y actualizar precios al iniciar
    useEffect(() => {
        actualizarPrecios();
        //console.log("estoy actualizando");
    }, []);

    // Guardar cambios en LocalStorage
    useEffect(() => {
        localStorage.setItem("carrito", JSON.stringify(carrito));
        //localStorage.clear();
        //setCarrito([]);
    }, [carrito]);

    // Función para agregar productos
    const agregarAlCarrito = (producto) => {
        setCarrito((prev) => {
            // Verificar si el producto tiene tallas o colores
            const tieneVariaciones =
                (producto.sizes && producto.sizes.length > 0) ||
                (producto.colors && producto.colors.length > 0);

            if (!tieneVariaciones) {
                // Producto sin variaciones
                const existe = prev.find((p) => p.id === producto.id);

                if (existe) {
                    return prev.map((p) =>
                        p.id === producto.id
                            ? { ...p, quantity: p.quantity + producto.quantity }
                            : p
                    );
                }

                return [
                    ...prev,
                    {
                        ...producto,
                        variations: [], // Mantener la estructura uniforme
                        quantity: producto.quantity,
                    },
                ];
            }

            // Producto con variaciones
            const newVariation = {
                color: producto.selectedColor || null,
                size: producto.selectedSize || null,
                quantity: producto.quantity,
            };

            const productoExistenteIndex = prev.findIndex(
                (p) => p.id === producto.id
            );

            if (productoExistenteIndex >= 0) {
                const newCarrito = [...prev];
                const productoExistente = newCarrito[productoExistenteIndex];

                const variacionExistenteIndex =
                    productoExistente.variations?.findIndex(
                        (v) =>
                            v.color === newVariation.color &&
                            v.size === newVariation.size
                    ) ?? -1;

                if (variacionExistenteIndex >= 0) {
                    newCarrito[productoExistenteIndex] = {
                        ...productoExistente,
                        variations: productoExistente.variations.map(
                            (v, index) =>
                                index === variacionExistenteIndex
                                    ? {
                                          ...v,
                                          quantity:
                                              v.quantity +
                                              newVariation.quantity,
                                      }
                                    : v
                        ),
                    };
                } else {
                    newCarrito[productoExistenteIndex] = {
                        ...productoExistente,
                        variations: [
                            ...productoExistente.variations,
                            newVariation,
                        ],
                    };
                }

                return newCarrito;
            } else {
                return [
                    ...prev,
                    {
                        ...producto,
                        variations: [newVariation],
                        quantity: producto.quantity, // Evitar que se fije en 1
                    },
                ];
            }
        });
    };

    // Función para eliminar un producto
    const eliminarProducto = (id) => {
        setCarrito((prev) => prev.filter((p) => p.id !== id));
    };

    // Función para vaciar carrito
    const vaciarCarrito = () => {
        setCarrito([]);
    };

    // Función para incrementar cantidad
    const incrementarCantidad = (id, variation = null) => {
        setCarrito((prev) => {
            return prev.map((item) => {
                // Producto sin variaciones
                if (
                    item.id === id &&
                    (!item.variations || item.variations.length === 0)
                ) {
                    return {
                        ...item,
                        quantity: item.quantity + 1,
                    };
                }

                // Producto con variaciones
                if (
                    item.id === id &&
                    item.variations &&
                    item.variations.length > 0
                ) {
                    // Si no se especifica variación, incrementamos la primera (podrías ajustar esto)
                    if (!variation) {
                        return {
                            ...item,
                            variations: item.variations.map((v, i) =>
                                i === 0 ? { ...v, quantity: v.quantity + 1 } : v
                            ),
                        };
                    }

                    // Incrementar la variación específica
                    return {
                        ...item,
                        variations: item.variations.map((v) =>
                            v.color === variation.color &&
                            v.size === variation.size
                                ? { ...v, quantity: v.quantity + 1 }
                                : v
                        ),
                    };
                }

                return item;
            });
        });
    };

    // Función para decrementar cantidad
    const decrementarCantidad = (id, variation = null) => {
        setCarrito((prev) => {
            return prev.map((item) => {
                // Producto sin variaciones
                if (
                    item.id === id &&
                    (!item.variations || item.variations.length === 0)
                ) {
                    return {
                        ...item,
                        quantity: Math.max(1, item.quantity - 1), // No permitir menos de 1
                    };
                }

                // Producto con variaciones
                if (
                    item.id === id &&
                    item.variations &&
                    item.variations.length > 0
                ) {
                    // Si no se especifica variación, decrementamos la primera
                    if (!variation) {
                        const newVariations = item.variations.map((v, i) =>
                            i === 0
                                ? {
                                      ...v,
                                      quantity: Math.max(1, v.quantity - 1),
                                  }
                                : v
                        );

                        return {
                            ...item,
                            variations: newVariations,
                        };
                    }

                    // Decrementar la variación específica
                    const newVariations = item.variations.map((v) =>
                        v.color === variation.color && v.size === variation.size
                            ? { ...v, quantity: Math.max(1, v.quantity - 1) }
                            : v
                    );

                    return {
                        ...item,
                        variations: newVariations,
                    };
                }

                return item;
            });
        });
    };

    // Función para eliminar producto cuando cantidad llega a 0 (opcional)
    const eliminarSiCero = (id, variation = null) => {
        setCarrito((prev) => {
            // Productos sin variaciones
            if (!variation) {
                return prev.filter(
                    (item) => !(item.id === id && item.quantity === 0)
                );
            }

            // Productos con variaciones
            return prev
                .map((item) => {
                    if (item.id === id && item.variations) {
                        const newVariations = item.variations.filter(
                            (v) =>
                                !(
                                    v.color === variation.color &&
                                    v.size === variation.size &&
                                    v.quantity === 0
                                )
                        );

                        // Si no quedan variaciones, eliminamos el producto
                        if (newVariations.length === 0) {
                            return null;
                        }

                        return {
                            ...item,
                            variations: newVariations,
                        };
                    }
                    return item;
                })
                .filter(Boolean); // Eliminar nulls
        });
    };

    return (
        <CarritoContext.Provider
            value={{
                carrito,
                agregarAlCarrito,
                eliminarProducto,
                vaciarCarrito,
                actualizarPrecios,
                decrementarCantidad,
                incrementarCantidad,
                eliminarSiCero,
            }}
        >
            {children}
        </CarritoContext.Provider>
    );
};
