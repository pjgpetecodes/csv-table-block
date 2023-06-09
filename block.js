(function (blocks, components, i18n, element, editor, serverSideRender) {
    var el = element.createElement;
    var __ = i18n.__;

    var MediaUpload = editor.MediaUpload;
    var Button = components.Button;
    
    blocks.registerBlockType('csv-table-block/block', {
        title: __('CSV Table Block', 'csv-table-block'),
        icon: 'table-row-after',
        category: 'widgets',
        attributes: {
            tableHTML: { // Add a new attribute to store the table HTML
              type: 'string',
              default: '',
            },
            isImported: { // Add a new attribute to store the import status
              type: 'boolean',
              default: false,
            },
        },
        edit: function (props) {
            function importCSV(file) {

                var request = new XMLHttpRequest();
                request.open('GET', file.url, true);
                request.responseType = 'blob';
                request.onload = function () {
                    const reader = new FileReader();

                    reader.readAsText(request.response);
                    reader.onload = function (e) {
                        const contents = e.target.result;
                        const rows = contents.split('\n');

                        // Extract headers from the first row
                        const headers = rows[0].split(',');

                        // Create table rows
                        const tableRows = rows.slice(1).map((row) => {
                            const columns = row.split(',');
                            const formattedColumns = columns.map((column, index) => {
                                if (column.indexOf('http') !== -1) {
                                    return `<td><a href="${column}" target="_blank" rel="noopener noreferrer">${column}</a></td>`;
                                } else {
                                    return `<td>${column}</td>`;
                                }
                            });
                            return `<tr>${formattedColumns.join('')}</tr>`;
                        });

                        // Create the HTML table
                        const table = `
                        <!-- wp:table {"className":"is-style-stripes"} -->
                            <figure class="wp-block-table is-style-stripes">
                                <table>
                                <thead>
                                    <tr>
                                    ${headers.map((header) => `<th>${header}</th>`).join('')}
                                    </tr>
                                </thead>
                                <tbody>
                                    ${tableRows.join('')}
                                </tbody>
                                </table>
                            </figure>
                        <!-- /wp:table -->
                        `;

                        console.log('Table:', table);
                        props.setAttributes({ tableHTML: table, isImported: true }); // Set the tableHTML and isImported attribute values
                    };
                };

                request.send();
            }

            return el(
                'div',
                null,
                !props.attributes.isImported ?                     
                    el(
                        editor.MediaUploadCheck,
                        null,
                        el(MediaUpload, {
                            onSelect: importCSV,
                            allowedTypes: ['text/csv'],
                            render: function (_ref) {
                                var open = _ref.open;
                                return el(Button, { isPrimary: true, onClick: open }, __('Import CSV', 'csv-table-block'));    
                            }
                        })
                    )
                : 
                    el('div', { dangerouslySetInnerHTML: { __html: props.attributes.tableHTML } })
            );
        },
        save: function () {
            return el('div', { className: 'csv-table-block' }, 'CSV Table Block');
        }
    });
})(
    window.wp.blocks,
    window.wp.components,
    window.wp.i18n,
    window.wp.element,
    window.wp.editor,
    window.wp.serverSideRender
);
