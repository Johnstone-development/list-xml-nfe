function listarItens() {
    const fileInput = document.getElementById("xmlFile");
    const tabelaContainer = document.getElementById("tabela-container");
    const headerContainer = document.getElementById("header-container");

    if (!fileInput.files.length) {
        alert("Selecione um arquivo XML.");
        return;
    }

    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = function(event) {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(event.target.result, "text/xml");

        // Buscar o número da NF-e e o nome do emitente
        const numeroNFE = xmlDoc.getElementsByTagName("nNF")[0]?.textContent || "N/A";
        const emitente = xmlDoc.getElementsByTagName("xNome")[0]?.textContent || "N/A";
        const CNPJ = xmlDoc.getElementsByTagName('CNPJ')[0]?.textContent || "N/A";

        // Exibir as informações no header
        headerContainer.innerHTML = `
            <div class="header-info">
                <p>
                    <strong>Nota Fiscal:</strong> ${numeroNFE}
                </p>
                <p>
                    <strong>Emitente:</strong> ${emitente}
                </p>
                <p>
                    <strong>CNPJ:</strong> ${CNPJ}
                </p>
            </div>
        `;

        const itens = xmlDoc.getElementsByTagName("det");

        if (itens.length === 0) {
            tabelaContainer.innerHTML = "<p>Nenhum item encontrado.</p>";
            return;
        }

        let tabelaHTML = `
            <table>
                <thead>
                    <tr>
                        <th>Código</th>
                        <th>Descrição</th>
                        <th>Quantidade</th>
                        <th>Valor Unitário</th>
                        <th>Valor Total</th>
                    </tr>
                </thead>
                <tbody>
        `;

        for (let i = 0; i < itens.length; i++) {
            let item = itens[i];
            let codigo = item.getElementsByTagName("cProd")[0]?.textContent || "N/A";
            let descricao = item.getElementsByTagName("xProd")[0]?.textContent || "N/A";
            let quantidade = item.getElementsByTagName("qCom")[0]?.textContent || "0";
            let valorUnitario = item.getElementsByTagName("vUnCom")[0]?.textContent || "0.00";
            let valorTotal = item.getElementsByTagName("vProd")[0]?.textContent || "0.00";

            tabelaHTML += `
                <tr>
                    <td>
                        ${codigo} 
                        <button class="copy-btn" onclick="copiarTexto('${codigo}')"><i class="fa-solid fa-copy"></i></button>
                    </td>
                    <td>
                        ${descricao} 
                        <button class="copy-btn" onclick="copiarTexto('${descricao}')"><i class="fa-solid fa-copy"></i></button>
                    </td>
                    <td>${quantidade}</td>
                    <td>R$ ${parseFloat(valorUnitario).toFixed(2)}</td>
                    <td>R$ ${parseFloat(valorTotal).toFixed(2)}</td>
                </tr>
            `;
        }

        tabelaHTML += `</tbody></table>`;
        tabelaContainer.innerHTML = tabelaHTML;
    };

    reader.readAsText(file);
}

function copiarTexto(texto) {
    navigator.clipboard.writeText(texto).then(() => {
        alert("Copiado: " + texto);
    }).catch(err => {
        console.error("Erro ao copiar", err);
    });
}