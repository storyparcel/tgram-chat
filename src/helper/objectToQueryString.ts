const objectToQueryString = (object: any) => {
    return (Object.entries(object) ?? []).map(e => e.join('=')).join('&');
};

export default objectToQueryString;