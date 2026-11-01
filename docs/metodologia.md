# Metodología

El modelo avanza en pasos anuales de 2026 a 2050 para cada territorio. En 2026 reproduce exactamente los datos oficiales: desocupación, pobreza, pobreza infantil, indigencia, Gini, mortalidad infantil, fecundidad y población, esta última llevada a 2026 desde su último dato. Desde ahí, los controles cambian la trayectoria.

Las ecuaciones completas, con los coeficientes que usa el código, se ven también dentro del simulador, en la sección **Ecuaciones del modelo** y en cada ⓘ.

## 1. Adopción de IA (modelo de Bass)

$$A_{t+1}=A_t + k_t\left(p+q\frac{A_t}{A_{max}}\right)(A_{max}-A_t),\qquad A_{max}=0{,}9$$

- **Coeficientes:** $p=0{,}03\,a\,(1-0{,}6R)(1-0{,}3\tau)$ y $q=0{,}38\,a\,(1-0{,}6R)(1-0{,}3\tau)$, donde $a$ es la velocidad de la IA, $R$ la regulación y $\tau$ el impuesto a la IA.
- **Freno o impulso energético:** $k_t$ sale del bloque de recursos: si falta energía para el cómputo, la adopción se frena.
- **Rezago por territorio:** Londres 0 años, Europa 1, Argentina 1,5, América Latina 1,8.
- **2026 es igual en todos los escenarios,** porque es un dato observado.

## 2. Mercado laboral

Hay dos tipos de desocupación: la habitual $u^r$ y la estructural por IA $u^s$.

$$u^s_{t+1}=u^s_t + D_t(1-u_t) - C_t(1-u_t) - f_s\,u^s_t$$

- **$D_t$, empleo desplazado:** $\Delta A\cdot E\cdot s\cdot(1-2{,}5h)$, donde $E$ es la exposición, $s$ la sustitución y $h$ la reducción de jornada.
- **$C_t$, empleo creado:** $0{,}25\,\Delta A\,E\,(1-s)$.
- **$f_s$, reinserción:** $0{,}25\,(1+0{,}8\,\text{recalificación})$ por año.

## 3. Valor del trabajo humano

$$LS_t = LS_0\,\frac{TE_t}{TE_0}\,(1-\pi_t R_t) - (\rho_t-\rho_0),\qquad \rho_t=0{,}35\,A_t\,E\,(0{,}3+0{,}6\,s)$$

- **$LS$:** parte del ingreso que va al trabajo. Datos de partida: Argentina 46 % (INDEC), UE 57 %, España 59,1 % (OIT).
- **$R_t$:** fracción de desplazados que se reubicaron.
- **$\pi_t$:** su pérdida salarial, entre 11 % y 22 % según la desocupación (Davis y von Wachter, 2011). La recalificación la reduce hasta un 25 %.
- **Salario real medio:** $100\cdot\frac{m_t}{m_0}\frac{LS_t}{LS_0}\Big/\frac{TE_t}{TE_0}$.

## 4. Ingreso, pobreza y desigualdad

- **Distribución del ingreso:** log-normal, con $\sigma$ calibrado desde el Gini oficial.
- **Cuándo sube la desigualdad:**
  - cuando el capital capta renta de la IA, en la parte no gravada;
  - cuando sube la desocupación;
  - cuando los reubicados cobran menos.
- **Cuándo baja la desigualdad:** con la formalización y la inversión educativa.
- **Medidas de pobreza:** índices FGT (incidencia, brecha, severidad) en forma cerrada.
- **Líneas de pobreza:** absoluta en Argentina, Mendoza, CABA y América Latina; relativa (60 % de la mediana) en Madrid y la UE; Londres después del costo de la vivienda.
- **Transferencias:**
  - el ingreso básico y la asignación por hijo llegan al 85 % de la población objetivo;
  - las personas en hogares con niños reciben también la asignación;
  - todas se pagan solo hasta la capacidad fiscal.

## 5. Cierre fiscal

$$T_{t+1}=f\,\max(0,D_t)+0{,}03\,B_t\qquad B_{t+1}=B_t+(1-f)\max(0,D_t)$$

- **Cómo se financia el déficit $D_t$:** en proporción $f$ con impuestos, que bajan el ingreso disponible y 0,05 puntos de crecimiento por cada punto de impuesto, y el resto con deuda $B_t$ al 3 % real.
- **Tope de capacidad fiscal:** impuestos nuevos más endeudamiento no pueden pasar el 15 % del ingreso de los hogares por año. Si las transferencias cuestan más, se pagan en parte.

## 6. Población

$$P_{t+1}=P_t\left(1+\frac{TBN_t-TBM_t+M_t-X_t}{1000}\right)$$

- **Natalidad y fecundidad:** la natalidad sigue a la fecundidad (TGF). La TGF se acerca a un piso que suben las políticas de natalidad, y que bajan la desocupación y la pérdida de valor del trabajo.
- **Migración:** el saldo migratorio de referencia está calibrado con las proyecciones oficiales. Se le resta 0,25 ‰ por punto de desocupación extra y 0,3 ‰ por punto de caída de la parte del trabajo (supuestos).
- **Éxodo metropolitano:** en CABA, Madrid y Londres crece con el teletrabajo.

## 7. Bienestar subjetivo y tensión social

$$\Delta LS^{vida}_t = 0{,}7\ln\frac{y_t}{y_{2026}} - 0{,}7\,(u_t-u_0) - 1{,}4\,(u_t-u_0)(1-u_t)$$

**Bienestar:**
- quedar desocupado baja la satisfacción con la vida al menos 0,6 puntos (Clark y otros);
- la desocupación también afecta a los ocupados;
- el ingreso suma 0,3–0,5 desvíos estándar por log (Stevenson y Wolfers).

**Tensión social:** índice 0–100, donde 50 corresponde a 2026. Sube con la desocupación, la pobreza y la desigualdad por encima de 2026, y sobre todo con deterioros rápidos (privación relativa). Los pesos son un supuesto: el índice ordena escenarios, no predice protestas.

## 8. Crecimiento de la IA y recursos

- **Cómputo:** crece a 3,3× por año hasta el año de saturación, limitado por la potencia eléctrica disponible.
- **Electricidad, emisiones y agua:**
  - electricidad: GW × 8,76 × 0,7;
  - CO₂: 0,434 kg/kWh, menos la descarbonización;
  - agua: 9,84 L/kWh.
- **Inversión:** 38.000 M USD por GW.
- **Panel de Argentina:** los centros de datos previstos (Stargate) frente a la demanda eléctrica nacional.

## 9. Incertidumbre y conclusiones

- **Monte Carlo:** 150 corridas que sortean 11 supuestos inciertos:
  - exposición, sustitución, reinserción y desocupación estructural;
  - crecimiento y captura de renta;
  - eficacia de las políticas;
  - fecundidad, migración y mortalidad infantil;
  - velocidad de la IA.
- **Rango del 80 %:** percentiles 10 y 90.
- **Descomposición del cambio 2026→2050:**
  - *tendencia*: sin IA nueva ni políticas;
  - *IA*: escenario tecnológico elegido menos un mundo sin más adopción;
  - *políticas*: políticas elegidas menos ninguna política nueva.
- **Ranking de políticas:** efecto en 2050 de un paso adicional de cada política y su costo fiscal medio 2030–2050.
