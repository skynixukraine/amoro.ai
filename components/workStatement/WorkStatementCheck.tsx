import React, { useState, ChangeEvent, useEffect } from 'react';
import classes from '@/components/quotation/QuotationInvoice.module.css';
import { WorkStatementType, FileUpload } from '@/common/types';

interface TypeProp {
    hanldeGetworkStatement: (e: FileUpload[] | []) => void
    isDetail?: boolean;
    workStatement?: WorkStatementType;
    workStatements?: Array<WorkStatementType>;
}

const WorkStatementCheck: React.FC<TypeProp> = (props) => {
    const { hanldeGetworkStatement, isDetail, workStatement, workStatements } = props
    //const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [selectedDivs, setSelectedDivs] = useState<FileUpload[]>([]);
    const [count, setcount] = useState<number>(0)

    useEffect(() => {
        hanldeGetworkStatement(selectedDivs);
    }, [selectedDivs])

    // const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    //     const newFiles = Array.from(e.target.files || []);
    //     setSelectedFiles([...selectedFiles, ...newFiles]);
    // };

    const handleDivClick = (file: FileUpload) => {
        if (selectedDivs.includes(file)) {
            setSelectedDivs(selectedDivs.filter((item) => item !== file));
            setcount(count - 1)

        } else {
            setSelectedDivs([...selectedDivs, file]);
            if (count >= 0) {
                setcount(count + 1)
            }


        }
    };

    console.log('workStatements===', workStatements)
    return (
        <div className={classes.container_work}>
            <div className={classes.formContainer_Statement}>
                <div className={classes.title_layout}>
                    <p className={classes.text_title}>Work Statement Request</p>
                </div>
                {workStatements && workStatements?.map((row, key) => (
                    row.requestNumber && <div key={key} className={classes.box_container}>
                        <p className={classes.text_file}>{row.requestNumber}</p>
                        <a target='_blank' href={`/work-statement/${row.id}`} className={classes.check_box} >
                            Open
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
}
export default WorkStatementCheck;
