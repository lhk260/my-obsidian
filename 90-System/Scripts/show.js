/**
 * Main view function for processing and displaying note sections
 * @param {object} dv - Dataview plugin instance
 * @param {object} input - Configuration parameters
 */
module.exports = async function(dv, input) {
    const {
        files,     // Array of files to process
        kwd,       // Optional keywords to filter content
        showHead,  // Boolean to control header display
        tars,      // Target sections to extract (e.g., {'LINKS': 2})
        scale = 1, // Display scale factor (default 1)
        li        // Function to format list items
    } = input;

    // Result collection
    let results = [];

    // Process each file
    for (const page of files) {
        try {
            // Load file content
            const content = await dv.io.load(page.file.path);
            
            // Process each target section
            for (const [sectionName, headingLevel] of Object.entries(tars)) {
                // Find sections starting with specified heading level
                const regex = new RegExp(`^#{${headingLevel}} ${sectionName}\\s*$([\\s\\S]*?)(?=^#{1,${headingLevel}}|$)`, 'gm');
                const matches = Array.from(content.matchAll(regex));

                for (const match of matches) {
                    let sectionContent = match[1].trim();
                    
                    // Skip empty sections
                    if (!sectionContent) continue;

                    // Apply keyword filtering if specified
                    if (kwd && !kwd.some(keyword => 
                        sectionContent.toLowerCase().includes(keyword.toLowerCase())
                    )) {
                        continue;
                    }

                    // Add formatted content to results
                    results.push(li([page, sectionContent]));
                }
            }
        } catch (error) {
            console.error(`Error processing ${page.file.path}:`, error);
            continue;
        }
    }

    // Apply scaling if needed
    if (scale !== 1) {
        return dv.paragraph(
            `<div style="font-size: ${scale * 100}%">${results.join('\n\n')}</div>`
        );
    }

    return results.join('\n\n');
}