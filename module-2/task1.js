function reverseString(string) {
  return string.split("").reverse().join("");
}

process.stdin.on("data", (data) => {
  console.log(reverseString(data.toString()) + "\n");
});

// I don't like the empty line after each input.
