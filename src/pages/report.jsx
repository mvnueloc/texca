import React, { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import Header from "../components/common/header.jsx";
import HorizontalSpliter from "../components/common/spliter.jsx";
import Summary from "../components/reports/summary.jsx";
import Actions from "../components/reports/actions.jsx";

import MicIcon from "../components/icons/mic.jsx";
import Chat from "../components/reports/chat.jsx";

export default function Report() {
  const [showChat, setShowChat] = useState(false);
  const { city, state, country } = useParams();
  const [messages, setMessages] = useState([]);

  // Estados para almacenar datos de la API y el estado de carga/error
  const [temperature, setTemperature] = useState(null);
  const [precipitation, setPrecipitation] = useState(null);
  const [humidity, setHumidity] = useState(null);
  const [ndvi, setNdvi] = useState(null);
  const [evapotranspiration, setEvapotranspiration] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // URL de la API (por ahora, usando localhost)
  const apiUrl = "http://localhost:8000/get_report";

  // Coordenadas de ejemplo (puedes cambiarlas según tu lógica)
  const location = {
    latitude: 19.4326, // Ejemplo: Ciudad de México
    longitude: -99.1332,
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(location),
        });

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        // Extraer los datos relevantes de la API
        setTemperature(
          data.weather_data.average_temperature_last_5days_centigrades
        );
        setPrecipitation(data.weather_data.total_precipitation_last_5days_mm);
        setHumidity(data.soil_moisture_data.mean_soil_moisture * 100); // Convertir a porcentaje si es necesario
        setNdvi(data.ndvi_data.mean_ndvi);
        setEvapotranspiration(data.average_evapotranspiration);
      } catch (err) {
        console.error("Error al obtener datos de la API:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [apiUrl]);

  // Lista de acciones (puedes modificarla según tus necesidades)
  const action_list = [
    {
      description:
        "Regar los cultivos en las próximas 24 horas debido a la baja humedad del suelo.",
    },
    {
      description:
        "Aplicar fertilizante nitrogenado para aprovechar condiciones de humedad actuales.",
    },
    {
      description:
        "Monitorear la aparición de plagas debido a las altas temperaturas.",
    },
    {
      description:
        "Considerar la instalación de sistema de riego por goteo para optimizar el uso del agua.",
    },
  ];

  // // Mostrar un mensaje de carga o error si es necesario
  // if (loading) return <p>Cargando datos...</p>;
  // if (error) return <p>Error: {error}</p>;

  const handleChat = () => {
    setShowChat(!showChat);
  };

  return (
    <>
      <div className="h-[100dvh] min-h-96 w-[100dvw] flex flex-col">
        {/* Header */}
        <Header
          text={`Reporte para ${state}, ${country}`}
          className="mx-auto md:max-w-4xl"
        />
        <div className="h-[1.5px] bg-neutral-300 mb-3" />

        {/* --------------------Container------------------- */}
        <main
          className={`flex-grow w-full mx-auto ${
            showChat ? "md:max-w-7xl" : "md:max-w-4xl"
          }`}>
          <HorizontalSpliter
            initialSize={showChat ? 50 : 0}
            style={{ transition: "width 0.9s" }}>
            {/* ------------------------Chat logic AI------------------------------- */}
            <div
              className={`h-full w-full px-2
                ${showChat ? "block" : "hidden"}
              `}>
              <section className=" w-full h-full">
                <Chat
                  messages={messages}
                  setMessages={setMessages}
                  setShowChat={setShowChat}
                  state={state}
                  country={country}
                  temperature={temperature}
                  precipitation={precipitation}
                  humidity={humidity}
                />
              </section>
            </div>

            <div
              className={`flex flex-grow h-full flex-col
                ${showChat ? "max-sm:hidden" : "block"}
              `}>
              {/* ----------------------------Summary------------------- */}
              <section className="flex-grow relative w-full overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                <div className="absolute inset-0 pb-4 px-2 space-y-3">
                  <Summary
                    temperature={temperature}
                    precipitation={precipitation}
                    humidity={humidity}
                    ndvi={ndvi}
                    evapotranspiration={evapotranspiration}
                  />
                  <Actions action_list={action_list} />
                </div>
              </section>

              <div
                className={`w-full mx-auto md:max-w-4xl px-2 pb-10 pt-4 md:pt-10 md:pb-24
                ${showChat ? "hidden" : "block"}
                `}>
                <section className="w-full max-w-xs sm:max-w-sm md:max-w-lg mx-auto flex flex-col gap-3">
                  <button
                    className="w-full py-2 bg-black rounded-md text-white inline-flex items-center justify-center gap-2"
                    onClick={handleChat}>
                    <MicIcon className="size-3.5" />
                    Preguntar al Asistente
                  </button>
                </section>
              </div>
            </div>
          </HorizontalSpliter>
        </main>
      </div>
    </>
  );
}
