// Helper function to convert standard date/time output to day/month/year

const dateFormat = (dateToFormat) => {
    const date = new Date(dateToFormat);
    const day = date.toISOString().slice(8,10);
    const month = date.toISOString().slice(5,7);
    const year = date.toISOString().slice(2,4);

    return `${day}/${month}/${year}`;
}

export default dateFormat