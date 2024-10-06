import React, { useState, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Loader2 } from "lucide-react";

// Inicializar la API de Google Generative AI
const genAI = new GoogleGenerativeAI(
  import.meta.env.VITE_GOOGLE_GENERATIVE_AI_API_KEY
);

// Componente Spinner
const Spinner = () => (
  <div className="flex justify-center items-center py-4">
    <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
  </div>
);

export default function Actions({
  state,
  country,
  temperature,
  precipitation,
  humidity,
}) {
  const [actionList, setActionList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchRecommendations() {
      setIsLoading(true);
      try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `Basado en la siguiente información:
          Estado: ${state}
          País: ${country}
          Temperatura: ${temperature}°C
          Precipitación: ${precipitation} mm
          Humedad: ${humidity}%
          
          Por favor, proporciona una lista de 5 acciones recomendadas para agricultores o jardineros. Cada acción debe ser una frase corta y útil. Responde SOLO con un array JSON de objetos, donde cada objeto tiene una propiedad 'description'. No incluyas texto adicional ni explicaciones fuera del JSON.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Parsear el JSON directamente
        const recommendations = JSON.parse(text);

        if (!Array.isArray(recommendations) || recommendations.length === 0) {
          throw new Error(
            "No se recibieron recomendaciones válidas de la API."
          );
        }

        setActionList(recommendations);
      } catch (error) {
        console.error("Error al obtener recomendaciones:", error);
        setActionList([
          {
            description:
              "No se pudieron cargar las recomendaciones. Por favor, intente más tarde.",
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchRecommendations();
  }, [state, country, temperature, precipitation, humidity]);

  return (
    <article className="w-full rounded-md border-[1.5px] border-neutral-300 px-4 py-4">
      <h2 className="text-xl font-semibold mb-6 md:mb-10">
        Acciones recomendadas
      </h2>
      <section className="flex flex-col gap-1">
        {isLoading ? (
          <Spinner />
        ) : (
          <ul className="list-disc list-inside text-sm text-pretty space-y-1 px-2">
            {actionList.map((action, index) => (
              <li
                key={index}
                className="text-base">
                {action.description}
              </li>
            ))}
          </ul>
        )}
      </section>
    </article>
  );
}
