# Simulador de IA y Políticas Sociales 2026–2050

Tablero interactivo que proyecta, año por año desde los datos oficiales de 2026 hasta 2050, cómo la adopción de inteligencia artificial y las políticas de Estado afectan el empleo, el valor del trabajo humano, la pobreza (sobre todo la infantil), la desigualdad, la población, el bienestar y la tensión social. Incluye además el crecimiento de la IA y los recursos que consume: electricidad, agua, emisiones e inversión.

**Ver el simulador funcionando:** https://vgomezmza.github.io/simulador-ia-sociedad/

Territorios: Argentina · Mendoza · Ciudad de Buenos Aires · América Latina y el Caribe · Comunidad de Madrid · Londres · Unión Europea.

## Qué pregunta responde

Si la IA desplaza tareas a un ritmo dado, ¿qué combinación de políticas públicas evita que suban la desocupación, la pobreza y la desigualdad, cuánto cuesta y quién la paga?

No es una predicción. Es un modelo de mecanismos con datos oficiales de partida y supuestos explícitos. Sirve para comparar escenarios, entender órdenes de magnitud y ver qué conclusiones se sostienen ante la incertidumbre.

## Qué incluye

- **22 controles** de tecnología y de política: velocidad de la IA, sustitución del trabajo humano, regulación, impuesto a la renta de la IA, ingreso básico, asignación por hijo, recalificación, formalización, reducción de jornada, financiamiento, natalidad, migración, vivienda, educación, salud, teletrabajo, energía, agua y centros de datos. Cada control dice qué resultados mueve.
- **Proyección con inicio fijo en 2026**: los gráficos muestran desde el dato oficial hasta el año elegido, o el horizonte completo 2026–2050.
- **Valor del trabajo humano**: qué parte del ingreso va a los trabajadores, salario real medio y salario de quien pierde el empleo por la IA y consigue otro.
- **Bienestar subjetivo** (satisfacción con la vida, 0–10) y **tensión social** (índice compuesto).
- **Conclusiones a 2050 automáticas**:
  - 150 futuros posibles por Monte Carlo, con rango del 80 %;
  - la descomposición del cambio en tendencia, IA y políticas;
  - un ranking de políticas por pobreza evitada por punto de costo.
- **Cierre fiscal**: las políticas se pagan con impuestos o deuda, con un tope de capacidad fiscal.
- **Validación**: el escenario base reproduce las proyecciones demográficas oficiales (INE, GLA, JRC/Eurostat, CEPAL, Argendata/CIPPEC), y el tablero corre más de 2.800 pruebas de consistencia desde el navegador.
- Secciones que se abren y se cierran, explicaciones detalladas en cada ⓘ, versión para celular y pantalla completa.

## Cómo usarlo

1. Abrí el enlace de arriba (o el archivo `index.html` en cualquier navegador).
2. Elegí el territorio y el año.
3. Mové los controles o elegí un escenario guardado.
4. Leé el bloque **Conclusiones a 2050**. Los números entre paréntesis comparan contra el mismo escenario sin políticas nuevas.

Todo se calcula en el navegador; no hay servidor ni datos personales.

## Estructura del proyecto

| Archivo | Contenido |
|---|---|
| `index.html` | El simulador completo: modelo, interfaz y documentación en un solo archivo |
| `docs/metodologia.md` | Ecuaciones y supuestos del modelo |
| `docs/validacion.md` | Contraste con proyecciones oficiales y pruebas de consistencia |
| `docs/fuentes.md` | Fuentes de datos |
| `tests/spec.js` | Especificación automática de credibilidad (más de 1.500 pruebas) |

Para correr las pruebas (requiere [Node.js](https://nodejs.org)):

```bash
node tests/spec.js
```

## Límites

- **Lo que no modela:** inflación, tipo de cambio, crisis financieras, cambios de régimen político ni pandemias. En Argentina la inflación suele dominar la pobreza de corto plazo.
- **Lo que no desagrega:** la población por edad, género ni nivel educativo.
- **Lo que es supuesto:** las reacciones de la migración y la fecundidad al deterioro laboral y los pesos del índice de tensión social. Están marcados en amarillo en la tabla de calibración.

## Autor

Victor Javier Gómez Saá · [mercurycad.com.ar](https://mercurycad.com.ar) · vgomez40@mercurycad.com.ar
