// MyLinkWidget.jsx
import React from "react";
import { MyLinkSegment } from "./MyLinkSegment";

export const MyLinkWidget = props => {
    console.log("Rendering MyLinkWidget");
    const { link } = props;
    const points = link.getPoints();

    // Generate the path for the link
    const path = React.useMemo(
        () =>
            points
                .map((point, index) => {
                    if (index === points.length - 1) {
                        return;
                    }
                    return (
                        <MyLinkSegment
                            key={`segment-${index}`}
                            path={`${points[index].getX()},${points[index].getY()} ${points[index + 1].getX()},${points[index + 1].getY()}`}
                            selected={link.isSelected()}
                            color={link.getOptions().color}
                        />
                    );
                })
                .filter(Boolean),
        [link, points]
    );

    // Calculate the angle of the arrow
    const angle =
        90 +
        (Math.atan2(
            points[points.length - 1].getY() - points[points.length - 2].getY(),
            points[points.length - 1].getX() - points[points.length - 2].getX()
        ) *
            180) /
        Math.PI;

    return (
        <g stroke-width={link.getOptions().width}>
            {path}
            <g
                className="arrow"
                transform={
                    'translate(' +
                    points[points.length - 1].getX() +
                    ', ' +
                    points[points.length - 1].getY() +
                    ')'
                }
            >
                <g style={{ transform: 'rotate(' + angle + 'deg)' }}>
                    <g transform={'translate(0, -3)'}>
                        <polygon
                            points="0,20 16,60 -16,60"
                            fill="red"
                            data-id={points[points.length - 1].getID()}
                            data-linkid={link.getID()}
                        />


                    </g>
                </g>
            </g>
        </g>
    );
};
