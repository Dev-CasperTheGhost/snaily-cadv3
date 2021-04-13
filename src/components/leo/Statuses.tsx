import * as React from "react";
import { connect } from "react-redux";
import { Code10 } from "types/Code10";
import { Officer } from "types/Officer";
import { Nullable, State } from "types/State";
import { get10Codes } from "@actions/admin/AdminActions";
import { getActiveOfficer, setStatus } from "@actions/officer/OfficerActions";
import Link from "next/link";
import { filterCodes } from "@lib/utils";
import { socket } from "@hooks/useSocket";
import { SocketEvents } from "types/Socket";
import { ModalIds } from "types/ModalIds";

interface Props {
  statuses: Code10[];
  activeOfficer: Nullable<Officer>;
  getActiveOfficer: (headers?: any) => void;
  setStatus: (officer: Pick<Officer, "id" | "status" | "status2">) => void;
  get10Codes: () => void;
}

const StatusesC: React.FC<Props> = ({
  statuses,
  activeOfficer,
  getActiveOfficer,
  setStatus,
  get10Codes,
}) => {
  React.useEffect(() => {
    get10Codes();
  }, [get10Codes]);

  React.useEffect(() => {
    const handler = () => getActiveOfficer();

    socket.on(SocketEvents.UpdateActiveUnits, handler);

    return () => {
      socket.off(SocketEvents.UpdateActiveUnits, handler);
    };
  }, [getActiveOfficer]);

  function updateStatus(e: any) {
    const status = e.target.value;

    /* little spam protection */
    if (status === activeOfficer?.status2) return;

    setStatus(activeOfficer!);
  }

  return (
    <>
      {activeOfficer ? (
        <button
          className={
            activeOfficer?.status2 === "10-8"
              ? "btn btn-primary col-sm-1"
              : "btn btn-secondary col-sm-1"
          }
          type="button"
          onClick={updateStatus}
          value="10-8"
        >
          10-8
        </button>
      ) : (
        <button
          type="button"
          data-bs-toggle="modal"
          data-bs-target={`#${ModalIds.SelectOfficer}`}
          className="btn btn-secondary col-sm-1"
        >
          10-8
        </button>
      )}

      {statuses.length <= 0 ? (
        <p>
          You can now have custom 10 codes for your CAD!{" "}
          <Link href="/admin/manage/10-codes">
            <a>If you&apos;re an admin, please add them here</a>
          </Link>
        </p>
      ) : (
        <>
          {filterCodes(statuses)
            .filter((code) => {
              const values = code.what_pages.map((page) => {
                return page.value;
              });

              return values.includes("leo");
            })
            .map((code: Code10, idx: number) => {
              return (
                <button
                  disabled={!activeOfficer || activeOfficer?.status === "off-duty"}
                  className={
                    activeOfficer?.status2 === code.code
                      ? "btn btn-primary col-sm-1"
                      : `btn ${code.color} col-sm-1`
                  }
                  type="button"
                  id={`${idx}`}
                  key={idx}
                  onClick={updateStatus}
                  value={code.code}
                >
                  {code.code}
                </button>
              );
            })}
        </>
      )}
    </>
  );
};

const mapToProps = (state: State) => ({
  statuses: state.admin.codes,
  activeOfficer: state.officers.activeOfficer,
});

const Memoized = React.memo(StatusesC);

export const Statuses = connect(mapToProps, { getActiveOfficer, setStatus, get10Codes })(Memoized);
