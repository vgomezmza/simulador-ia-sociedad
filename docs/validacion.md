# Validación

## Contra proyecciones oficiales

Con todos los controles en su valor por defecto, la población proyectada se compara con la proyección oficial de cada territorio. El saldo migratorio de referencia, el supuesto más incierto, está calibrado para que coincidan. El resto de la dinámica responde a los controles.

| Territorio | Proyección oficial | Oficial | Modelo (base) | Diferencia | Fuente |
|---|---|---|---|---|---|
| Madrid 2041 | 8,20 M en 2041 | 8,20 M | 8,20 M | −0,1 % | INE |
| Londres 2050 | 10,52–10,92 M (central) | 10,72 M | 10,71 M | −0,0 % | Greater London Authority |
| UE 2050 | pico de 453 M en 2029, ~445 M en 2050 | 445 M | 444,5 M | −0,1 % | JRC / Eurostat |
| América Latina 2050 | +8,5 % hacia 2050 (máximo ~730 M en 2053) | 698,3 M | 698,0 M | −0,0 % | CEPAL |
| Argentina 2050 | pico ~5 % sobre la actual; nunca 50 M | 48,84 M | 48,84 M | −0,0 % | Argendata / CIPPEC |
| CABA 2050 | estable en torno a 3,1 M | 3,15 M | 3,15 M | −0,0 % | INDEC / IDECBA |

## Pruebas automáticas (`tests/spec.js`)

Más de 1.500 comprobaciones, que deben pasar todas:

1. **Calibración 2026.** En cualquier escenario, cada territorio reproduce su dato oficial de desocupación, pobreza, pobreza infantil, indigencia, Gini, mortalidad infantil, fecundidad y adopción.
2. **Dirección de cada política.** Subir cada control mueve sus resultados en el sentido esperado. Por ejemplo, más recalificación baja la desocupación, y más sustitución del trabajo humano baja la parte del ingreso para el trabajo, el salario y la población.
3. **Rangos plausibles.** En escenarios guardados, extremos y 150 combinaciones aleatorias:
   - ningún indicador sale de rangos posibles;
   - ningún valor es "NaN";
   - la desocupación queda entre 1,5 % y 40 %;
   - la participación del trabajo queda entre 15 % y 85 %.
4. **Sin saltos imposibles.** Ningún año la desocupación se mueve más de 3,5 puntos, la pobreza más de 15 (el máximo histórico reciente en Argentina) ni la población más de 3 %.
5. **Contrafáctico.** Sin políticas nuevas, el escenario coincide exactamente con la línea punteada.
6. **Proyecciones oficiales.** La tabla de arriba, con tolerancia.
7. **Respuesta monótona.** Más ingreso básico nunca sube la pobreza, y más velocidad tecnológica nunca baja la adopción.

El simulador trae además un botón **Ejecutar pruebas de consistencia** que corre en el navegador más de 2.800 pruebas: estas y las del Monte Carlo, la descomposición y el ranking de políticas.

## Qué no prueba

Que los coeficientes supuestos sean correctos. La validación asegura coherencia interna y anclaje a datos y proyecciones oficiales, no que el futuro vaya a ser así.
