import { View, Text, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { Form, UserType } from "@/config/enums";
import { useState } from "react";

import { RegisterFormProps } from "@/types/component";

export default function RegisterForm({ setError, setForm, userType }: RegisterFormProps) {

    // FORM DE USUARIO
    const [uName, setUName] = useState("");
    const [uSurname, setUSurname] = useState("");
    const [uGender, setUGender] = useState("");
    const [uEmail, setUEmail] = useState("");
    const [uPassword, setUPassword] = useState("");
    const [uCar, setUCar] = useState("");

    // FORM COMERCIO
    const [ceoName, setCeoName] = useState("");
    const [ceoSurname, setCeoSurname] = useState("");
    const [ceoGender, setCeoGender] = useState("");
    const [ceoEmail, setCeoEmail] = useState("");
    const [ceoPassword, setCeoPassword] = useState("");
    const [ceoPhone, setCeoPhone] = useState("");

    const [commerceName, setCommerceName] = useState("");
    const [commerceRTN, setCommerceRTN] = useState("");

    function handleRegister() {

        // 🌟 FORMULARIO DE USUARIO
        if (userType === UserType.USER) {
            const output = {
                person: {
                    name: uName,
                    surname: uSurname,
                    gender: uGender,
                    email: uEmail,
                    password: uPassword
                },
                customer: {
                    car: uCar
                }
            };

            console.log("USER JSON OUTPUT:", output);
            return;
        }

        // 🌟 FORMULARIO DE COMERCIO
        const output = {
            ceodata: {
                person: {
                    name: ceoName,
                    surname: ceoSurname,
                    gender: ceoGender,
                    email: ceoEmail,
                    password: ceoPassword,
                    active: true
                },
                CEO: {
                    telefono: ceoPhone
                }
            },
            commerceData: {
                name: commerceName,
                rtn: commerceRTN,
                activo: true
            }
        };

        console.log("COMMERCE JSON OUTPUT:", output);
    }

    return (
        <>

            {/* --------------- FORMULARIO DE USUARIO --------------- */}
            { userType === UserType.USER && (
                <>
                    <Text style={styles.section}>Datos Personales</Text>

                    <Text style={styles.label}>Nombre</Text>
                    <TextInput style={styles.input} value={uName} onChangeText={setUName} />

                    <Text style={styles.label}>Apellido</Text>
                    <TextInput style={styles.input} value={uSurname} onChangeText={setUSurname} />

                    <Text style={styles.label}>Género</Text>
                    <TextInput style={styles.input} value={uGender} onChangeText={setUGender} />

                    <Text style={styles.label}>Correo electrónico</Text>
                    <TextInput style={styles.input} value={uEmail} onChangeText={setUEmail} />

                    <Text style={styles.label}>Contraseña</Text>
                    <TextInput
                        style={styles.input}
                        secureTextEntry
                        value={uPassword}
                        onChangeText={setUPassword}
                    />

                    <Text style={styles.section}>Datos del Cliente</Text>

                    <Text style={styles.label}>Carro</Text>
                    <TextInput style={styles.input} value={uCar} onChangeText={setUCar} />
                </>
            )}

            {/* --------------- FORMULARIO COMERCIO --------------- */}
            { userType === UserType.COMMERCE && (
                <>
                    <Text style={styles.section}>Datos del CEO</Text>

                    <Text style={styles.label}>Nombre</Text>
                    <TextInput style={styles.input} value={ceoName} onChangeText={setCeoName} />

                    <Text style={styles.label}>Apellido</Text>
                    <TextInput style={styles.input} value={ceoSurname} onChangeText={setCeoSurname} />

                    <Text style={styles.label}>Género</Text>
                    <TextInput style={styles.input} value={ceoGender} onChangeText={setCeoGender} />

                    <Text style={styles.label}>Correo</Text>
                    <TextInput style={styles.input} value={ceoEmail} onChangeText={setCeoEmail} />

                    <Text style={styles.label}>Contraseña</Text>
                    <TextInput
                        style={styles.input}
                        secureTextEntry
                        value={ceoPassword}
                        onChangeText={setCeoPassword}
                    />

                    <Text style={styles.label}>Teléfono</Text>
                    <TextInput style={styles.input} value={ceoPhone} onChangeText={setCeoPhone} />

                    <Text style={styles.section}>Datos del Comercio</Text>

                    <Text style={styles.label}>Nombre del comercio</Text>
                    <TextInput style={styles.input} value={commerceName} onChangeText={setCommerceName} />

                    <Text style={styles.label}>RTN</Text>
                    <TextInput style={styles.input} value={commerceRTN} onChangeText={setCommerceRTN} />
                </>
            )}

            {/* BOTÓN */}
            <View style={{ alignItems: "center", marginTop: 10 }}>
                <TouchableOpacity style={styles.button} onPress={handleRegister}>
                    <Text style={styles.buttonText}>Registrarse</Text>
                </TouchableOpacity>

                <Text
                    onPress={() => setForm(Form.LOGIN)}
                    style={{ marginVertical: 15 }}>
                    ¿Ya tienes cuenta?{" "}
                    <Text style={{ fontWeight: "bold", color: "#275C9C" }}>
                        ¡Inicia sesión!
                    </Text>
                </Text>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    input: {
        borderRadius: 10,
        borderColor: "lightgray",
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
        paddingVertical: 10,
    },
    button: {
        borderRadius: 10,
        backgroundColor: "#275C9C",
        paddingVertical: 10,
        alignItems: "center",
        width: "60%",
    },
    buttonText: {
        fontSize: 15,
        fontWeight: "bold",
        color: "#fff",
    },
    label: {
        fontSize: 15,
        fontWeight: "bold",
    },
    section: {
        marginTop: 15,
        marginBottom: 5,
        fontSize: 17,
        fontWeight: "bold",
        color: "#275C9C",
    }
});
