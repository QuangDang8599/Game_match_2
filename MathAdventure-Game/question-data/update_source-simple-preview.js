const fs = require("fs");
const path = require("path");

const MAX_LEVEL = 9;

function loadLevel(file) {
    let text = fs.readFileSync(file, "utf8");

    // window.level1Questions = [...]
    text = text.replace(/^window\.\w+\s*=\s*/, "");

    return eval(text);
}

function detectUnit(prompt) {
    if (prompt.includes("cm")) return "cm";
    if (prompt.includes("dm")) return "dm";
    if (prompt.includes("km")) return "km";
    if (prompt.includes(" m")) return "m";
    return "";
}

function detectTopic(prompt, topic) {

    if (topic)
        return topic;

    if (prompt.includes("cm"))
        return "Tính độ dài cm";

    if (prompt.includes("dm"))
        return "Đơn vị đo";

    if (prompt.includes("km"))
        return "Đơn vị đo";

    return "Toán";
}

let output = [];

output.push("// Auto generated. DO NOT EDIT.");
output.push("");
output.push("window.sourceSimplePreviewQuestions = [");

let id = 1;

for (let level = 1; level <= MAX_LEVEL; level++) {

    const file = path.join(__dirname, `level${level}.js`);

    if (!fs.existsSync(file))
        continue;

    const list = loadLevel(file);

    list.forEach(q => {

        output.push(
`  {
    id: 'SRC-SIMPLE-${String(id).padStart(3,'0')}',
    level: ${level},
    prompt: ${JSON.stringify(q.prompt)},
    answer: ${q.answer},
    unit: ${JSON.stringify(detectUnit(q.prompt))},
    topic: ${JSON.stringify(detectTopic(q.prompt, q.topic))},
    sourceParagraph: 0
  },`
        );

        id++;

    });

}

output.push("];");

fs.writeFileSync(
    path.join(__dirname, "source-simple-preview.js"),
    output.join("\n")
);

console.log("Done.");