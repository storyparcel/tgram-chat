import Lottie from 'lottie-react';
import LoadingJson from '../assets/gifs/loading.json';

interface ILoading {
    size?: number;
    loading: boolean;
};

const Loading: React.FC<ILoading> = (props) => {
    if (props.loading) {
        return (
            <Lottie
                animationData={LoadingJson}
                style={{
                    width: props.size ?? 36,
                    height: props.size ?? 36,
                }}
            />
        );
    }

    return null;
};

export default Loading;