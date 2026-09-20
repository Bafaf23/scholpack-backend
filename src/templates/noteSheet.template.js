/**
 * Plantilla de consolidado de calificaciones por sección y año (Soporta hasta 12+ materias en Portrait).
 */
export function noteSheet({
  section,
  loadAcademic,
  laspseActive,
  school,
  grades = {},
}) {
  const validSubjects = Array.isArray(loadAcademic?.[0]?.academicLoad)
    ? loadAcademic[0].academicLoad
    : [];
  const validStudents = Array.isArray(section?.students)
    ? section.students
    : [];

  const totalEstudiantes = validStudents.length;
  const aprobados = validStudents.filter((s) => s.status === "aprobado").length;
  const aplazados = totalEstudiantes - aprobados;
  const reprobados = validStudents.filter(
    (s) => s.status === "reprobado",
  ).length;
  const eficiencia =
    totalEstudiantes > 0
      ? ((aprobados / totalEstudiantes) * 100).toFixed(2)
      : "0.00";

  const normalizedGrades = Array.isArray(grades)
    ? Object.assign({}, ...grades)
    : grades;

  // CÁLCULO DINÁMICO DE DENSIDAD SEGÚN MATERIAS
  const subjectCount = validSubjects.length;
  const isHighDensity = subjectCount >= 9;

  // Clases condicionales según cantidad de materias
  const fontSizeName = isHighDensity ? "text-[8.5px]" : "text-[9.5px]";
  const fontSizeGrades = isHighDensity ? "text-[8px]" : "text-[10px]";
  const fontSizeHeaders = isHighDensity ? "text-[8px]" : "text-[9px]";
  const colWidthName = isHighDensity
    ? "w-[95px] min-w-[95px]"
    : "w-[110px] min-w-[110px]";
  const cellPadding = isHighDensity ? "p-0" : "p-0.5";

  return `<!DOCTYPE html>
  <html lang="es" class="bg-white h-full">
    <head>
      <meta charset="UTF-8">
      <script src="https://cdn.tailwindcss.com"></script>
      <style>
        @media print {
          @page {
            size: portrait;
            margin: 0.4cm;
          }
          body { color: #0f172a; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
        /* Garantiza que la tabla respete estrictamente los anchos calculados */
        table {
          table-layout: fixed;
          width: 100%;
        }
      </style>
    </head>
    <body class="antialiased text-slate-800 p-0">
      <main class="max-w-[210mm] mx-auto bg-white p-2 min-h-screen flex flex-col justify-between">
        <div>
          <!-- Encabezado Oficial -->
          <header class="flex justify-between items-center border-b-2 border-slate-200 pb-1.5 text-xs">
            <div>
              <h2 class="font-bold text-[10px] text-slate-500">República Bolivariana de Venezuela</h2>
              <p class="font-bold text-slate-500 text-[10px]">Ministerio del Poder Popular para la Educación</p>
              <h1 class="font-black uppercase text-slate-900 text-sm mt-0.5">${
                school?.name || "N/A"
              }</h1>
            </div>
            <div class="text-right text-[11px] text-slate-600 space-y-0.5">
              <p><span class="font-bold">Fecha:</span> ${new Date().toLocaleDateString(
                "es-VE",
              )}</p>
              <p><strong class="font-bold">Código SIG:</strong> ${
                school?.SIG || "N/A"
              }</p>
            </div>
          </header>
  
          <!-- Resumen del Informe -->
          <section class="my-1.5 flex justify-between items-center bg-slate-50 border border-slate-200 p-1.5 rounded-lg">
            <div>
              <span class="text-[8px] font-bold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                Control de Estudios
              </span>
              <h2 class="text-xs font-black text-slate-950 tracking-tight mt-0.5">Consolidado Anual de Calificaciones</h2>
            </div>
            <div class="text-right text-[11px] font-medium text-slate-700 space-y-0.5 flex gap-3">
              <p><strong class="text-slate-900">Año/Sección:</strong> ${
                section?.name || ""
              } "${section?.nomenclature || ""}"</p>
              <p><strong class="text-slate-900">Período:</strong> ${
                laspseActive?.period?.name || "N/A"
              }</p>
            </div>
          </section>
  
          <!-- Tabla Consolidada de Notas -->
          <div class="overflow-hidden border-2 border-slate-300 rounded-lg shadow-sm">
            <table class="w-full border-collapse text-center">
              <thead>
                <!-- Fila 1: Materias -->
                <tr class="bg-slate-900 text-white font-bold uppercase tracking-wider text-[9px]">
                  <th rowspan="2" class="p-1 border-r border-b border-slate-800 w-[50px]">Cédula</th>
                  <th rowspan="2" class="text-left p-1 pl-1.5 bg-slate-950 border-r border-b border-slate-800 ${colWidthName}">Nombre y Apellido</th>
                  ${validSubjects
                    .map(
                      (subject) => `
                    <th colspan="4" class="p-0.5 border-r border-b border-slate-800 bg-indigo-950/70 text-indigo-100 text-center font-black overflow-hidden truncate" title="${
                      subject.subject?.name || ""
                    }">
                      ${subject.subject?.abbreviation || "MAT"}
                    </th>`,
                    )
                    .join("")}
                  <th rowspan="2" class="p-1 bg-slate-800 text-slate-200 w-[28px] border-b border-slate-700 text-[8px]">Prom</th>
                  <th rowspan="2" class="p-1 bg-slate-800 text-slate-200 w-[45px] border-b border-slate-700 text-[8px]">Estatus</th>
                </tr>
                <!-- Fila 2: Subcolumnas de Lapsos -->
                <tr class="bg-slate-800 text-slate-300 font-bold ${fontSizeHeaders} border-b border-slate-300">
                  ${validSubjects
                    .map(
                      () => `
                    <th class="p-0 border-r border-slate-700">L1</th>
                    <th class="p-0 border-r border-slate-700">L2</th>
                    <th class="p-0 border-r border-slate-700">L3</th>
                    <th class="p-0 border-r border-slate-600 bg-indigo-900/50 text-indigo-200 font-black">DEF</th>`,
                    )
                    .join("")}
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-200 text-slate-800">
                ${validStudents
                  .map((student) => {
                    const studentCardId =
                      student.tuition_number || student.id_card;
                    const studentGrades = normalizedGrades[studentCardId] || {};
                    const defScores = [];

                    return `
                  <tr class="odd:bg-slate-50/60">
                    <td class="p-0.5 border-r border-slate-200 font-mono text-[8.5px] text-slate-600 align-middle truncate">${studentCardId}</td>
                    
                    <!-- Celda de Nombre Completo ajustada al modo de alta densidad -->
                    <td class="text-left p-1 pl-1.5 font-bold text-slate-900 border-r border-slate-200 uppercase whitespace-normal break-words ${colWidthName}${fontSizeName} leading-tight align-middle">
                      ${student.name}${student.last_name}
                    </td>

                    ${validSubjects
                      .map((subject) => {
                        const subjectCode = subject.subject?.abbreviation;
                        const subjectData = studentGrades[subjectCode] || {};

                        const l1 = subjectData.L1 ?? "-";
                        const l2 = subjectData.L2 ?? "-";
                        const l3 = subjectData.L3 ?? "-";
                        const def = subjectData.DEF ?? subjectData.score ?? "-";

                        if (typeof def === "number" && !isNaN(def)) {
                          defScores.push(def);
                        }

                        const esAplazado = typeof def === "number" && def < 10;

                        return `
                      <td class="${cellPadding} border-r border-slate-100 ${fontSizeGrades} text-slate-500 align-middle">${l1}</td>
                      <td class="${cellPadding} border-r border-slate-100 ${fontSizeGrades} text-slate-500 align-middle">${l2}</td>
                      <td class="${cellPadding} border-r border-slate-100 ${fontSizeGrades} text-slate-500 align-middle">${l3}</td>
                      <td class="${cellPadding} border-r border-slate-200 ${fontSizeGrades} font-bold bg-indigo-50/40 align-middle ${
                        esAplazado
                          ? "text-red-600 bg-red-100/60 font-black"
                          : "text-slate-950"
                      }">
                        ${def}
                      </td>`;
                      })
                      .join("")}
                    ${(() => {
                      const average =
                        defScores.length > 0
                          ? Math.round(
                              defScores.reduce((acc, curr) => acc + curr, 0) /
                                defScores.length,
                            )
                          : 0;

                      return `<td class="p-0 border-r font-black bg-slate-100 text-slate-950 ${fontSizeGrades} align-middle">${average}</td>`;
                    })()}
                    <td class="p-0 font-bold uppercase text-[7.5px] align-middle ${
                      student.status === "aprobado"
                        ? "text-emerald-800 bg-emerald-100/50"
                        : "text-amber-800 bg-amber-100/50"
                    }">
                      ${student.status || "Cursando"}
                    </td>
                  </tr>`;
                  })
                  .join("")}
              </tbody>
            </table>
          </div>
  
          <!-- Estadísticas Generales -->
          <section class="mt-2 grid grid-cols-4 gap-2 text-center text-xs">
            <div class="bg-slate-50 border border-slate-200 p-1 rounded-lg">
              <p class="font-bold text-slate-500 uppercase tracking-wider text-[8px]">Eficiencia</p>
              <p class="text-xs font-black text-slate-900 mt-0.5">${eficiencia}%</p>
            </div>
            <div class="bg-indigo-50/40 border border-indigo-100 p-1 rounded-lg">
              <p class="font-bold text-indigo-600 uppercase tracking-wider text-[8px]">Aprobados</p>
              <p class="text-xs font-black text-indigo-950 mt-0.5">${aplazados} Est.</p>
            </div>
            <div class="bg-amber-50/40 border border-amber-100 p-1 rounded-lg">
              <p class="font-bold text-amber-700 uppercase tracking-wider text-[8px]">Aplazados (EE)</p>
              <p class="text-xs font-black text-amber-950 mt-0.5">${aplazados} Est.</p>
            </div>
            <div class="bg-red-50/40 border border-red-100 p-1 rounded-lg">
              <p class="font-bold text-red-700 uppercase tracking-wider text-[8px]">Reprobados</p>
              <p class="text-xs font-black text-red-950 mt-0.5">${reprobados} Est.</p>
            </div>
          </section>
        </div>
  
        <!-- Firmas -->
        <div class="mt-2">
          <footer class="grid grid-cols-2 gap-8 text-center text-xs">
            <div class="flex flex-col items-center">
              <div class="w-36 border-b-2 border-slate-300 h-4"></div>
              <p class="mt-1 font-bold text-slate-900 text-[11px]">${
                section?.guide
                  ? `${section.guide.name}${section.guide.last_name}`
                  : "Docente Guía"
              }</p>
              <p class="text-[8px] text-slate-400 uppercase font-bold">Firma Autorizada</p>
            </div>
            <div class="flex flex-col items-center">
              <div class="w-36 border-b-2 border-slate-300 h-4"></div>
              <p class="mt-1 font-bold text-slate-900 text-[11px]">Coordinación de Control de Estudios</p>
              <p class="text-[8px] text-slate-400 uppercase font-bold">Firma y Sello Húmedo</p>
            </div>
          </footer>
        </div>
      </main>
    </body>
  </html>`;
}
