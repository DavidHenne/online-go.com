/*
 * Copyright (C) 2012-2022  Online-Go.com
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import * as React from "react";
import { _ } from "translate";

import { TimeControl, TimeControlTypes } from "./TimeControl";
import { time_options } from "./util";

type TimeControlSystem = TimeControlTypes.TimeControlSystem;
type TimeControlSpeed = TimeControlTypes.TimeControlSpeed;
type OnTimeControlChangeCallback = (tc: TimeControl) => void;

interface NewTimeControlPickerProperties {
    timeControl: TimeControl;
    onChange?: OnTimeControlChangeCallback;
    boardWidth?: number;
    boardHeight?: number;
}

interface TimePropertyDescription<T extends TimeControl, U extends keyof T> {
    property: U;
    name: string;
    id: string;
}

const fischerSelectors: TimePropertyDescription<
    TimeControlTypes.Fischer,
    keyof TimeControlTypes.Fischer
>[] = [
    { property: "initial_time", name: _("Initial Time"), id: "challenge-initial-time" },
    { property: "time_increment", name: _("Time Increment"), id: "challenge-inc-time" },
    { property: "max_time", name: _("Max Time"), id: "challenge-max-time" },
];
const simpleSelectors: TimePropertyDescription<
    TimeControlTypes.Simple,
    keyof TimeControlTypes.Simple
>[] = [{ property: "per_move", name: _("Time per Move"), id: "challenge-per-move-time" }];
const canadianSelectors: TimePropertyDescription<
    TimeControlTypes.Canadian,
    keyof TimeControlTypes.Canadian
>[] = [
    { property: "main_time", name: _("Main Time"), id: "challenge-main-time-canadian" },
    {
        property: "period_time",
        name: _("Time per Period"),
        id: "challenge-per-canadian-period-time",
    },
];
const byoyomiSelectors: TimePropertyDescription<
    TimeControlTypes.ByoYomi,
    keyof TimeControlTypes.ByoYomi
>[] = [
    { property: "main_time", name: _("Main Time"), id: "challenge-main-time-byoyomi" },
    {
        property: "period_time",
        name: _("Time per Period"),
        id: "challenge-per-byoyomi-period-time",
    },
];
const absoluteSelectors: TimePropertyDescription<
    TimeControlTypes.Absolute,
    keyof TimeControlTypes.Absolute
>[] = [{ property: "total_time", name: _("Total Time"), id: "challenge-total-time" }];

export function NewTimeControlPicker(props: NewTimeControlPickerProperties): JSX.Element {
    // const update = (property: keyof TimeControl) => {
    //     const new = updateProperty(props.timeControl, p)
    // }
    const tc = props.timeControl;
    let selectors: JSX.Element[];

    switch (tc.system) {
        case "fischer":
            selectors = fischerSelectors.map((desc) => {
                return (
                    <TimeControlPropertySelector
                        tc={tc}
                        id={desc.id}
                        name={desc.name}
                        property={desc.property}
                        valueGetter={(ev) => parseInt(ev.target.value)}
                        onChange={props.onChange}
                    ></TimeControlPropertySelector>
                );
            });
            break;
        case "simple":
            selectors = simpleSelectors.map((desc) => {
                return (
                    <TimeControlPropertySelector
                        tc={tc}
                        id={desc.id}
                        name={desc.name}
                        property={desc.property}
                        valueGetter={(ev) => parseInt(ev.target.value)}
                        onChange={props.onChange}
                    ></TimeControlPropertySelector>
                );
            });
            break;
        case "canadian":
            selectors = canadianSelectors.map((desc) => {
                return (
                    <TimeControlPropertySelector
                        tc={tc}
                        id={desc.id}
                        name={desc.name}
                        property={desc.property}
                        valueGetter={(ev) => parseInt(ev.target.value)}
                        onChange={props.onChange}
                    ></TimeControlPropertySelector>
                );
            });
            selectors.push(
                <TimeControlPropertyInput
                    tc={tc}
                    id={"challenge-canadian-stones"}
                    name={_("Stones per Period")}
                    property={"stones_per_period"}
                    min={default_time_options[tc.speed].canadian.stones_per_period_min}
                    max={default_time_options[tc.speed].canadian.stones_per_period_max}
                    valueGetter={(ev) => parseInt(ev.target.value)}
                    onChange={props.onChange}
                ></TimeControlPropertyInput>,
            );
            break;
        case "byoyomi":
            selectors = byoyomiSelectors.map((desc) => {
                return (
                    <TimeControlPropertySelector
                        tc={tc}
                        id={desc.id}
                        name={desc.name}
                        property={desc.property}
                        valueGetter={(ev) => parseInt(ev.target.value)}
                        onChange={props.onChange}
                    ></TimeControlPropertySelector>
                );
            });
            selectors.push(
                <TimeControlPropertyInput
                    tc={tc}
                    id={"challenge-periods-byoyomi"}
                    name={_("Periods")}
                    property={"periods"}
                    min={default_time_options[tc.speed].byoyomi.periods_min}
                    max={default_time_options[tc.speed].byoyomi.periods_max}
                    valueGetter={(ev) => parseInt(ev.target.value)}
                    onChange={props.onChange}
                ></TimeControlPropertyInput>,
            );
            break;
        case "absolute":
            selectors = absoluteSelectors.map((desc) => {
                return (
                    <TimeControlPropertySelector
                        tc={tc}
                        id={desc.id}
                        name={desc.name}
                        property={desc.property}
                        valueGetter={(ev) => parseInt(ev.target.value)}
                        onChange={props.onChange}
                    ></TimeControlPropertySelector>
                );
            });
            break;
    }
    return <>{selectors}</>;
}

interface TimeControlPropertySelectorProps<T extends TimeControl, U extends keyof T> {
    tc: T;
    id: string;
    name: string;
    property: U;
    valueGetter: (ev: React.ChangeEvent<HTMLSelectElement>) => T[U];
    onChange: OnTimeControlChangeCallback;
}

function TimeControlPropertySelector<T extends TimeControl, U extends keyof T>(
    props: TimeControlPropertySelectorProps<T, U>,
): JSX.Element {
    return (
        <div id={`${props.id}-group`} className="form-group challenge-time-group">
            <label id={`${props.id}-label`} className=" control-label" htmlFor={props.id}>
                {props.name}
            </label>
            <div className="controls">
                <div className="checkbox">
                    <select
                        id={props.id}
                        className="form-control time-spinner"
                        value={`${props.tc[props.property]}`}
                        onChange={(ev: React.ChangeEvent<HTMLSelectElement>) => {
                            const new_tc = updateProperty(
                                props.tc,
                                props.property,
                                props.valueGetter(ev),
                            );
                            props.onChange(new_tc);
                        }}
                    >
                        {time_options[props.tc.speed][props.tc.system][props.property].map(
                            (it, idx) => (
                                <option key={idx} value={it.time}>
                                    {it.label}
                                </option>
                            ),
                        )}
                    </select>
                </div>
            </div>
        </div>
    );
}

interface TimeControlPropertyInputProps<T extends TimeControl, U extends keyof T> {
    tc: T;
    id: string;
    name: string;
    property: U;
    min: number;
    max: number;
    valueGetter: (ev: React.ChangeEvent<HTMLInputElement>) => T[U];
    onChange: OnTimeControlChangeCallback;
}

function TimeControlPropertyInput<T extends TimeControl, U extends keyof T>(
    props: TimeControlPropertyInputProps<T, U>,
): JSX.Element {
    return (
        <div id={`${props.id}-group`} className="form-group challenge-time-group">
            <label id={`${props.id}-label`} className=" control-label" htmlFor={props.id}>
                {props.name}
            </label>
            <div className="controls">
                <div className="checkbox">
                    <input
                        type="number"
                        id={props.id}
                        min={props.min}
                        max={props.max}
                        className="challenge-dropdown form-control"
                        value={`${props.tc[props.property]}`}
                        onChange={(ev: React.ChangeEvent<HTMLInputElement>) => {
                            const new_tc = updateProperty(
                                props.tc,
                                props.property,
                                props.valueGetter(ev),
                            );
                            props.onChange(new_tc);
                        }}
                        onBlur={(sender) =>
                            numericInputOnBlur(
                                sender,
                                props.tc.speed,
                                props.tc.system,
                                props.property as string,
                            )
                        }
                    />
                </div>
            </div>
        </div>
    );
}

function updateProperty<T extends TimeControl, U extends keyof T>(
    timeControl: T,
    property: U,
    newValue: T[U],
): T {
    const copy: T = Object.assign({}, timeControl);
    copy[property] = newValue;
    return copy;
}

const default_time_options = {
    blitz: {
        system: "byoyomi",

        fischer: {
            initial_time: 30,
            time_increment: 10,
            max_time: 60,
            pause_on_weekends: false,
        },
        byoyomi: {
            main_time: 30,
            period_time: 5,
            periods: 5,
            periods_min: 1,
            periods_max: 300,
            pause_on_weekends: false,
        },
        canadian: {
            main_time: 30,
            period_time: 30,
            stones_per_period: 5,
            stones_per_period_min: 1,
            stones_per_period_max: 50,
            pause_on_weekends: false,
        },
        simple: {
            per_move: 5,
            pause_on_weekends: false,
        },
        absolute: {
            total_time: 300,
            pause_on_weekends: false,
        },
    },
    live: {
        system: "byoyomi",
        pause_on_weekends: false,
        fischer: {
            initial_time: 120,
            time_increment: 30,
            max_time: 300,
            pause_on_weekends: false,
        },
        byoyomi: {
            main_time: 10 * 60,
            period_time: 30,
            periods: 5,
            periods_min: 1,
            periods_max: 300,
            pause_on_weekends: false,
        },
        canadian: {
            main_time: 10 * 60,
            period_time: 180,
            stones_per_period: 10,
            stones_per_period_min: 1,
            stones_per_period_max: 50,
            pause_on_weekends: false,
        },
        simple: {
            per_move: 60,
            pause_on_weekends: false,
        },
        absolute: {
            total_time: 900,
            pause_on_weekends: false,
        },
    },
    correspondence: {
        system: "fischer",
        fischer: {
            initial_time: 3 * 86400,
            time_increment: 86400,
            max_time: 7 * 86400,
            pause_on_weekends: true,
        },
        byoyomi: {
            main_time: 7 * 86400,
            period_time: 1 * 86400,
            periods: 5,
            periods_min: 1,
            periods_max: 300,
            pause_on_weekends: true,
        },
        canadian: {
            main_time: 7 * 86400,
            period_time: 7 * 86400,
            stones_per_period: 10,
            stones_per_period_min: 1,
            stones_per_period_max: 50,
            pause_on_weekends: true,
        },
        simple: {
            per_move: 2 * 86400,
            pause_on_weekends: true,
        },
        absolute: {
            total_time: 28 * 86400,
            pause_on_weekends: true,
        },
        none: {
            pause_on_weekends: false,
        },
    },
};

// TODO: Guard against invalid combinations, such as
// { speed: "live", time_control_system: "none" }
// Currently, this causes a ts-strict implicit any error.
function numericInputOnBlur(
    sender: React.FocusEvent<HTMLInputElement, Element>,
    speed: TimeControlSpeed,
    time_control_system: TimeControlSystem,
    propertyName: string,
) {
    const num = sender.target.valueAsNumber;
    const min: number = default_time_options[speed][time_control_system][`${propertyName}_min`];
    const max: number = default_time_options[speed][time_control_system][`${propertyName}_max`];

    if (isNaN(num)) {
        sender.target.value = default_time_options[speed][time_control_system][`${propertyName}`];
    } else if (num < min || num > max) {
        sender.target.value = Math.min(Math.max(num, min), max).toString();
    }
}
