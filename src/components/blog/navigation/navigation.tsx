import Link from "next/link";
import styles from "./navigation.module.css";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

interface NavData {
    title: string;
    slug: string;
    description: string;
    date: string;
}

interface Props {
    prev?: NavData;
    next?: NavData;
}

interface CardProps extends NavData {
    isPrev?: boolean;
    isNext?: boolean;
}

const _Card = ({
    title,
    slug,
    description,
    date,
    isPrev,
    isNext,
}: CardProps) => {
    return (
        <div className={styles.card}>
            {isPrev && (
                <Link href={`/blog/${slug}`} >
                <div className={styles.cardIcon}>
                    <IoIosArrowBack size={32}  color="#878787"/>
                </div>
                </Link>
            )}
            <Link href={`/blog/${slug}`} className={styles.cardLink}>
                <div className={styles.cardHeader}>
                    <time className={styles.cardDate}>{date}</time>
                </div>
                <h2 className={styles.cardTitle}>{title}</h2>
                <p className={styles.cardDescription}>{description}</p>
            </Link>
            {isNext && (
                <Link href={`/blog/${slug}`} >
                <div className={styles.cardIcon}>
                    <IoIosArrowForward size={32} color="#878787"/>
                </div>
                </Link>
            )}
        </div>
    );
};

export const Navigation = ({ prev, next }: Props) => {
    return (
        <div className={styles.container}>
            {prev && (
                <div className={styles.prev}>
                    <_Card {...prev} isPrev />
                </div>
            )}
            {next && (
                <div className={styles.next}>
                    <_Card {...next} isNext />
                </div>
            )}
        </div>
    );
};
