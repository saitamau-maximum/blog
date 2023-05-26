import Link from "next/link";
import styles from "./navigation.module.css";

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

const _Card = ({ title, slug, date, description }: NavData) => {
    return (
        <div className={styles.card}>
            <Link href={`/blog/${slug}`} className={styles.cardLink}>
                <div className={styles.cardHeader}>
                    <time className={styles.cardDate}>{date}</time>
                </div>
                <h2 className={styles.cardTitle}>{title}</h2>
                <p className={styles.cardDescription}>{description}</p>
            </Link>
        </div>
    );
};

export const Navigation = ({ prev, next }: Props) => {
    return (
        <div className={styles.container}>
            {prev && (
                <div className={styles.prev}>
                    <h3 className={styles.prevTitle}>Previous</h3>
                    <_Card {...prev} />
                </div>
            )}
            {next && (
                <div className={styles.next}>
                    <h3 className={styles.nextTitle}>Next</h3>
                    <_Card {...next} />
                </div>
            )}
        </div>
    );
};
