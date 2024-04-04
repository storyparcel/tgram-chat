const NextLiner = ({ text }: { text: string }) => {
    return (
        <div>
            { text.split('\n').map((txt) => (
                <>
                    {txt}
                    <br />
                </>
            ))}
        </div>
    );
};

export default NextLiner;